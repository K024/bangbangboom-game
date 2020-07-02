import { Sprite, Container, Texture, ObservablePoint } from "pixi.js"
import { ObjectPool } from "../Utils/Utils"

class DigitSprite extends Sprite {
    constructor(public num: number, texture?: Texture) {
        super(texture)
        this.anchor.set(0.5)
    }
}

const charCodeZero = "0".charCodeAt(0)

class NumberContentSprite extends Container {
    private tex: Texture[] = []
    private spritepool: ObjectPool<DigitSprite>[] = []

    charWidth = 0
    charHeight = 0

    constructor(numberTextures: Texture[]) {
        super()
        this.tex = numberTextures
        this.charWidth = Math.max(...numberTextures.map(x => x.width))
        this.charHeight = Math.max(...numberTextures.map(x => x.height))
        for (let i = 0; i < 10; i++) {
            this.spritepool[i] = new ObjectPool(() => new DigitSprite(i, this.tex[i]))
        }
    }

    tint = 0xffffff
    /** the size of max height of number textures */
    fontSize = 36
    padding = 4

    setValue(num: number) {
        const digits = num
            .toFixed()
            .split("")
            .map(x => x.charCodeAt(0) - charCodeZero)
        const scale = this.fontSize / this.charHeight
        const dx = this.charWidth * scale + this.padding
        const offx = (this.charWidth * scale) / 2
        const offy = (this.charHeight * scale) / 2
        for (const x of this.children) {
            this.spritepool[(x as DigitSprite).num].save(x as DigitSprite)
        }
        this.removeChildren()
        for (let i = 0; i < digits.length; i++) {
            const x = digits[i]
            const s = this.spritepool[x].get()
            s.position.set(offx + dx * i, offy)
            s.scale.set(scale)
            s.tint = this.tint
            this.addChild(s)
        }
    }
}

export class NumberSprite extends Container {
    private content: NumberContentSprite
    constructor(numberTextures: Texture[]) {
        super()
        this.content = new NumberContentSprite(numberTextures)
        this.addChild(this.content)
        this.anchor = new ObservablePoint(() => {
            this.justifyPos()
        }, undefined)
    }

    get tint() {
        return this.content.tint
    }
    set tint(v) {
        this.content.tint = v
    }
    get fontSize() {
        return this.content.fontSize
    }
    set fontSize(v) {
        this.content.fontSize = v
    }
    get padding() {
        return this.content.padding
    }
    set padding(v) {
        this.content.padding = v
    }

    anchor: ObservablePoint

    setValue(num: number) {
        this.content.setValue(num)
        this.justifyPos()
    }

    private justifyPos() {
        const scale = this.fontSize / this.content.charHeight
        const width =
            this.content.children.length * this.content.charWidth * scale +
            (this.content.children.length - 1) * this.padding
        const height = this.content.charHeight * scale
        this.content.position.set(-width * this.anchor.x, -height * this.anchor.y)
    }
}
