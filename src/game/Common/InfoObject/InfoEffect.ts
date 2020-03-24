import { Texture, Container } from "pixi.js"
import { ParticleEmitter } from "../ParticleEmitter"
import { InfoSprite } from "./InfoSprite"
import { EffectInfo } from "./InfoType"
import { assert } from "../../../core/Utils"

export class InfoEffect extends Container {
    constructor(info: EffectInfo, textures?: { [name: string]: Texture }) {
        super()

        if (info.particles instanceof Array) {
            for (const x of info.particles) {
                const p = new ParticleEmitter(textures && x.textures.map(t => textures[t]) || [], x.option)
                p.currentTime = -(x.delay || 0)
                this.delaymap.set(p, -(x.delay || 0))
                this.addChild(p)
            }
        }

        if (info.sprites instanceof Array) {
            for (const x of info.sprites) {
                const s = new InfoSprite(x, textures)
                this.addChild(s)
            }
        }
    }

    private delaymap = new Map<ParticleEmitter, number>()

    update = (dt: number) => {
        if (!this.visible) return
        for (const x of this.children) {
            if (x instanceof InfoSprite || x instanceof ParticleEmitter) {
                x.update(dt)
            }
        }
    }

    setPosition(x: number, y: number) {
        const s = this.scale
        for (const c of this.children) {
            if (c instanceof InfoSprite) {
                c.position.set(x / s.x, y / s.y)
            } else if (c instanceof ParticleEmitter) {
                c.offset = { x: x / s.x, y: y / s.y }
            }
        }
    }

    resetAnim() {
        for (const x of this.children) {
            if (x instanceof ParticleEmitter) {
                x.currentTime = assert(this.delaymap.get(x))
                x.emitEnded = false
                x.allEnd = false
                x.visible = true
                x.canEmit = true
            } else if (x instanceof InfoSprite) {
                x.resetAnim()
            }
        }
    }

    stopEmit() {
        for (const x of this.children) {
            if (x instanceof ParticleEmitter) {
                x.canEmit = false
            } else if (x instanceof InfoSprite) {
                x.visible = false
            }
        }
    }

    allAnimEnd() {
        for (const x of this.children) {
            if (x instanceof ParticleEmitter) {
                if (!x.allEnd) return false
            } else if (x instanceof InfoSprite) {
                if (!x.allAnimEnd()) return false
            }
        }
        return true
    }
}

