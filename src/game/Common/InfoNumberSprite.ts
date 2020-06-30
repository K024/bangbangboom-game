import { NumberSprite } from "./NumberSprite"
import { Texture } from "pixi.js"
import { InfoSprite } from "./InfoObject/InfoSprite"
import { AnimationManager, CreatePixiPropSetter } from "./Animation/Animation"
import { NumberSpriteInfo, setPositionInfo } from "./InfoObject/InfoType"

const numberList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => x.toString())

export class InfoNumberSprite extends NumberSprite {
    constructor(info: NumberSpriteInfo, textures: { [name: string]: Texture }) {
        super(numberList.map(x => textures[x]))
        if (info.fontSize !== undefined) this.fontSize = info.fontSize
        if (info.fontTint !== undefined) this.tint = parseInt(info.fontTint.replace("#", "0x"))
        if (info.fontPadding !== undefined) this.padding = info.fontPadding
        setPositionInfo(this as any, info.position)

        this.animation.propSetter = CreatePixiPropSetter(this)

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
        this.animation.currentTime = 0
        for (const x of this.infoSprites) {
            x.resetAnim()
        }
    }

    allAnimEnd(): boolean {
        if (!this.animation.ended) return false
        for (const x of this.infoSprites) {
            if (!x.allAnimEnd()) return false
        }
        return true
    }
}
