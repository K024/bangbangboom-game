import { Container } from "pixi.js"


export class FixRatioContainer extends Container {
    constructor(initWidth: number, initHeight: number, public autoRotate = false) {
        super()
        this._width = initWidth
        this._height = initHeight
    }

    private _width: number
    private _height: number

    get width() { return this._width * this.scale.x }
    set width(v) {
        const p = v / this._width
        this.scale.set(p, p)
    }
    get height() { return this._height * this.scale.x }
    set height(v) {
        const p = v / this._height
        this.scale.set(p, p)
    }

    setInit(width: number, height: number) {
        this._width = width
        this._height = height
    }

    get ratio() { return this._width / this._height }

    resize(containerWidth: number, containerHeight: number, cover = false, hori = 0.5, vert = 0.5) {
        let cr = containerWidth / containerHeight
        const r = this.ratio
        if (this.autoRotate && (cr - 1) * (r - 1) < 0) {
            cr = containerHeight / containerWidth
            if ((cr > r) !== cover) {
                this.height = containerWidth
                this.x = containerWidth
                this.y = containerHeight * hori - this.width * hori
            } else {
                this.width = containerHeight
                this.x = containerWidth * vert + this.height * vert
                this.y = 0
            }
        } else {
            if ((cr > r) !== cover) {
                this.height = containerHeight
                this.x = containerWidth * hori - this.width * hori
                this.y = 0
            } else {
                this.width = containerWidth
                this.x = 0
                this.y = containerHeight * vert - this.height * vert
            }
        }
    }

}
