import { Sprite, Container, Texture, ObservablePoint } from "pixi.js"

class DigitSprite extends Sprite {
    constructor(public num: number, texture?: Texture) {
        super(texture)
        this.anchor.set(0.5)
    }
}

class NumberContentSprite extends Container {

    private tex: Texture[] = []
    private spritepool: DigitSprite[][] = []

    charWidth = 0
    charHeight = 0

    constructor(numberTextures: Texture[]) {
        super()
        this.tex = numberTextures
        this.charWidth = Math.max(...numberTextures.map(x => x.width))
        this.charHeight = Math.max(...numberTextures.map(x => x.height))
    }

    tint = 0xffffff
    /** the size of max height of number textures */
    fontSize = 36
    padding = 4

    setValue(num: number) {
        const digits = num.toFixed().split("").map(x => parseInt(x))
        const scale = this.fontSize / this.charHeight
        const dx = this.charWidth * scale + this.padding
        const offx = this.charWidth * scale / 2
        const offy = this.charHeight * scale / 2
        for (const x of this.children) {
            this.saveDigit(x as DigitSprite)
        }
        this.removeChildren()
        for (let i = 0; i < digits.length; i++) {
            const x = digits[i]
            const s = this.getDigit(x)
            s.position.set(offx + dx * i, offy)
            s.scale.set(scale)
            s.tint = this.tint
            this.addChild(s)
        }
    }

    private getDigit(x: number) {
        let pool = this.spritepool[x]
        if (pool === undefined) {
            pool = []
            this.spritepool[x] = pool
        }
        if (pool.length <= 0) {
            pool.push(new DigitSprite(x, this.tex[x]))
        }
        return pool.pop()!
    }

    private saveDigit(s: DigitSprite) {
        const x = s.num
        let pool = this.spritepool[x]
        if (pool === undefined) {
            pool = []
            this.spritepool[x] = pool
        }
        pool.push(s)
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

    get tint() { return this.content.tint }
    set tint(v) { this.content.tint = v }
    get fontSize() { return this.content.fontSize }
    set fontSize(v) { this.content.fontSize = v }
    get padding() { return this.content.padding }
    set padding(v) { this.content.padding = v }

    anchor: ObservablePoint

    setValue(num: number) {
        this.content.setValue(num)
        this.justifyPos()
    }

    private justifyPos() {
        const scale = this.fontSize / this.content.charHeight
        const width = this.content.children.length * this.content.charWidth * scale + (this.content.children.length - 1) * this.padding
        const height = this.content.charHeight * scale
        this.content.position.set(- width * this.anchor.x, - height * this.anchor.y)
    }
}
