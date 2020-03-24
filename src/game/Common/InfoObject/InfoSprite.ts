import { Sprite, Texture, BLEND_MODES } from "pixi.js"
import { AnimationManager, CreatePixiPropSetter } from "../Animation/Animation"
import { SpriteInfo, setPositionInfo } from "./InfoType"

export class InfoSprite extends Sprite {
    constructor(info: SpriteInfo, textures?: { [name: string]: Texture }) {
        super((info.texture && textures && textures[info.texture]) || undefined)
        this.animation.propSetter = CreatePixiPropSetter(this)

        if (info.position)
            setPositionInfo(this, info.position)

        if (info.animations instanceof Object) {
            for (const prop in info.animations) {
                this.animation.animations.set(prop, info.animations[prop])
            }
        }

        if (info.children instanceof Array) {
            for (const x of info.children) {
                const c = new InfoSprite(x, textures)
                this.addChild(c)
                this.infoSprites.push(c)
            }
        }

        if (info.blend === "add") this.blendMode = BLEND_MODES.ADD
        if (info.tint !== undefined)
            this.tint = parseInt(info.tint.replace("#", "0x"))

    }

    private infoSprites: InfoSprite[] = []

    animation = new AnimationManager()

    update = (dt: number) => {
        if (!this.visible) return
        this.animation.update(dt)
        for (const x of this.infoSprites) {
            x.update(dt)
        }
    }

    resetAnim() {
        this.visible = true
        this.animation.currentTime = 0
        for (const x of this.infoSprites)
            x.resetAnim()
    }

    allAnimEnd(): boolean {
        if (!this.animation.ended) return false
        for (const x of this.infoSprites) {
            if (!x.allAnimEnd()) return false
        }
        return true
    }
}

