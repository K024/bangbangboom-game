import { Texture, Container } from "pixi.js";
import { ParticleEmitter } from "./ParticleEmitter";
import { InfoSprite } from "./InfoSprite";
import { EffectInfo } from "./InfoType";

export class InfoEffect extends Container {
    constructor(info: EffectInfo, textures: { [name: string]: Texture }) {
        super()

        if (info.particles instanceof Array) {
            info.particles.forEach(x => {
                const p = new ParticleEmitter(x.textures.map(t => textures[t]), x.option)
                p.currentTime = -x.delay || 0
                this.delaymap.set(p, -x.delay || 0)
                this.addChild(p)
            })
        }

        if (info.sprites instanceof Array) {
            info.sprites.forEach(x => {
                const s = new InfoSprite(x, textures)
                this.addChild(s)
            })
        }
    }

    private delaymap = new Map<ParticleEmitter, number>()

    update = (dt: number) => {
        if (!this.visible) return
        this.children.forEach(x => {
            if (x instanceof InfoSprite || x instanceof ParticleEmitter) {
                x.update(dt)
            }
        })
    }

    setPosition(x: number, y: number) {
        const s = this.scale
        this.children.forEach(c => {
            if (c instanceof InfoSprite) {
                c.position.set(x / s.x, y / s.y)
            } else if (c instanceof ParticleEmitter) {
                c.offset = { x: x / s.x, y: y / s.y }
            }
        })
    }

    resetAnim() {
        this.children.forEach(x => {
            if (x instanceof ParticleEmitter) {
                x.currentTime = this.delaymap.get(x)
                x.emitEnded = false
                x.allEnd = false
                x.visible = true
                x.canEmit = true
            } else if (x instanceof InfoSprite) {
                x.resetAnim()
            }
        })
    }

    stopEmit() {
        this.children.forEach(x => {
            if (x instanceof ParticleEmitter) {
                x.canEmit = false
            } else if (x instanceof InfoSprite) {
                x.visible = false
            }
        })
    }

    allAnimEnd() {
        return this.children.findIndex(x => {
            if (x instanceof ParticleEmitter) {
                if (x.allEnd) return false
            } else if (x instanceof InfoSprite) {
                if (!x.visible) return false
                if (x.allAnimEnd()) return false
            }
            return true
        }) < 0
    }
}

