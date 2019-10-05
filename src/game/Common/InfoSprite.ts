import { Sprite, Texture, BLEND_MODES } from "pixi.js";
import { AnimationManager, CreatePixiTargetPropMapper } from "./Animation";
import { SpriteInfo, setPositionInfo } from "./InfoType";

export class InfoSprite extends Sprite {
    constructor(info: SpriteInfo, textures: { [name: string]: Texture }) {
        super(textures[info.texture])
        this.animation.targetPropMapper = CreatePixiTargetPropMapper(this)

        setPositionInfo(this, info.position)

        if (info.animations instanceof Object) {
            for (const prop in info.animations) {
                this.animation.animations.set(prop, info.animations[prop])
            }
        }

        if (info.children instanceof Array) {
            info.children.forEach(x => {
                const c = new InfoSprite(x, textures)
                this.addChild(c)
            })
        }

        if (info.blend === "add") this.blendMode = BLEND_MODES.ADD
        if (info.tint !== undefined)
            this.tint = parseInt(info.tint.replace("#", "0x"))

    }

    animation = new AnimationManager()

    update = (dt: number) => {
        if (!this.visible) return
        this.animation.update(dt)
        this.children.forEach(x => (x as InfoSprite).update(dt))
    }

    resetAnim() {
        this.visible = true
        this.animation.currentTime = 0
        this.children.forEach(x => (x as InfoSprite).resetAnim())
    }

    allAnimEnd(): boolean {
        return this.animation.ended
            && this.children.findIndex(x => !(x as InfoSprite).allAnimEnd()) < 0
    }
}

