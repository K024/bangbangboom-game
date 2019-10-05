import { setByte } from '../Utils/Utils'
import { GameEvent } from '../Utils/GameEvent'
import { Sprite, Texture, BLEND_MODES, Container } from 'pixi.js'

type RangeNumber = {
    base: number
    offset: number
} | {
    min: number
    max: number
} | number[] | number

function getRangeValue(n?: RangeNumber) {
    if (n === undefined) return undefined
    if (typeof n === "number") return n
    if (n instanceof Array)
        return n[Math.floor(Math.random() * n.length)]
    if ("max" in n) return n.min + Math.random() * (n.max - n.min)
    return n.base + (Math.random() * 2 - 1) * n.offset
}

function ratio(start: number, end: number, target: number, from?: number, to?: number) {
    if (to === undefined) return from
    const r = (target - start) / (end - start)
    return (to - from) * r + from
}

type ParticlePropertiesOption = {
    size?: RangeNumber
    spin?: RangeNumber
    r?: RangeNumber
    g?: RangeNumber
    b?: RangeNumber
    alpha?: RangeNumber
}

type ParticleProperties = {
    [P in keyof ParticlePropertiesOption]: number
}

export type ParticleOption = {
    duration: number
    emissionRate: number
    emitRect: {
        x: RangeNumber,
        y: RangeNumber,
    }

    lifeTime: RangeNumber
    /** facing right is 0, clockwise */
    radian: RangeNumber
    speed: RangeNumber
    gravity?: {
        x: number,
        y: number
    },
    /** 不同半径处的加速度 */
    accelRad?: RangeNumber
    /** 切线加速度 */
    accelTan?: RangeNumber

    start: ParticlePropertiesOption
    end: ParticlePropertiesOption

    blend?: "add" | "normal"
}

export class Particle extends Sprite {
    startX = 0
    startY = 0

    speedX = 0
    speedY = 0
    lifetime = 0
    currentTime = 0
    gravity: { x: number, y: number }
    accelRad = 0
    accelTan = 0

    start: ParticleProperties
    end: ParticleProperties

    constructor(texture: Texture) {
        super(texture)
        this.anchor.set(0.5)
    }

    setOption(option: ParticleOption, offset: { x: number, y: number }) {
        if (option.blend === "add")
            this.blendMode = BLEND_MODES.ADD
        const speed = getRangeValue(option.speed)
        const radian = getRangeValue(option.radian)
        this.speedX = speed * Math.cos(radian)
        this.speedY = speed * Math.sin(radian)
        this.lifetime = getRangeValue(option.lifeTime)
        this.gravity = option.gravity
        this.accelRad = getRangeValue(option.accelRad)
        this.accelTan = getRangeValue(option.accelTan)
        this.startX = getRangeValue(option.emitRect.x) + offset.x
        this.startY = getRangeValue(option.emitRect.y) + offset.y
        this.x = this.startX
        this.y = this.startY
        this.start = {
            size: getRangeValue(option.start.size),
            spin: getRangeValue(option.start.spin),
            r: getRangeValue(option.start.r),
            g: getRangeValue(option.start.g),
            b: getRangeValue(option.start.b),
            alpha: getRangeValue(option.start.alpha),
        }
        this.end = {
            size: getRangeValue(option.end.size),
            spin: getRangeValue(option.end.spin),
            r: getRangeValue(option.end.r),
            g: getRangeValue(option.end.g),
            b: getRangeValue(option.end.b),
            alpha: getRangeValue(option.end.alpha),
        }
    }

    shouldRemove = false

    // tslint:disable: no-bitwise
    /**
     * 
     * @param dt in seconds 
     */
    update(dt: number) {
        this.currentTime += dt
        if (this.currentTime > this.lifetime) {
            this.visible = false
            this.shouldRemove = true
            return
        }
        {
            this.x += this.speedX * dt
            this.y += this.speedY * dt

            let dvx = 0
            let dvy = 0
            if (this.gravity) {
                dvx += this.gravity.x
                dvy += this.gravity.y
            }
            if (this.accelTan) {
                dvx += this.accelTan * this.speedY
                dvy += this.accelTan * -this.speedX
            }
            if (this.accelRad) {
                dvx += this.accelRad * (this.x - this.startX)
                dvy += this.accelRad * (this.y - this.startY)
            }

            this.speedX += dvx * dt
            this.speedY += dvy * dt
        }
        {
            const setRatio = (prop: keyof ParticleProperties, set: (v: number) => void) => {
                const v = ratio(0, this.lifetime, this.currentTime, this.start[prop], this.end[prop])
                if (v !== undefined) {
                    set(v)
                }
            }
            setRatio("size", v => this.scale.set(v))
            setRatio("spin", v => this.rotation = v)
            setRatio("r", v => this.tint = setByte(this.tint, 2, v))
            setRatio("g", v => this.tint = setByte(this.tint, 1, v))
            setRatio("b", v => this.tint = setByte(this.tint, 0, v))
            setRatio("alpha", v => this.alpha = v)
        }
    }

}

export class ParticleEmitter extends Container {

    private freeIndexes: number[] = []

    constructor(private textures: Texture[], public option: ParticleOption) {
        super()
    }

    offset = { x: 0, y: 0 }

    private useParticle(index: number) {
        const x = this.children[index] as Particle
        x.visible = true
        x.setOption(this.option, this.offset)
        x.currentTime = 0
        const i = Math.floor(Math.random() * this.textures.length)
        x.texture = this.textures[i]
        return x
    }

    canEmit = true

    private destroyed = false
    currentTime = 0
    private counter = 0
    /**
     * 
     * @param dt in seconds
     */
    update(dt: number) {
        this.currentTime += dt
        if (this.destroyed || this.currentTime < 0) {
            return
        }
        if (this.currentTime - dt < 0) this.currentTime = 0

        if (this.canEmit && this.option.duration <= 0 || this.currentTime - dt < this.option.duration) {
            const time = this.option.duration > 0 ? (this.currentTime < this.option.duration ? dt : this.option.duration - this.currentTime + dt) : dt
            this.counter += time * this.option.emissionRate
            while (this.counter > 1) {
                this.counter -= 1
                if (this.freeIndexes.length <= 0) {
                    this.addChild(new Particle(this.textures[0]))
                    this.freeIndexes.push(this.children.length - 1)
                }
                const i = this.freeIndexes.pop()
                this.useParticle(i)
            }
        }

        let visibleCount = 0
        this.children.forEach((c, i) => {
            const p = c as Particle
            if (!p.visible) return
            p.update(dt)

            if (p.shouldRemove) {
                p.shouldRemove = false
                p.visible = false
                this.freeIndexes.push(i)
            }

            if (p.visible) visibleCount++
        })

        if (!this.canEmit || this.option.duration > 0 && this.currentTime >= this.option.duration) {
            if (!this.emitEnded) this.onEmitEnd.emit()
            this.emitEnded = true
        } else {
            this.emitEnded = false
        }
        if (visibleCount <= 0 && this.emitEnded) {
            if (!this.allEnd) this.onAllEnd.emit()
            this.allEnd = true
        } else {
            this.allEnd = false
        }
    }

    onEmitEnd = new GameEvent<[]>()
    emitEnded = false
    onAllEnd = new GameEvent<[]>()
    allEnd = false

    destroy() {
        this.destroyed = true
        this.removeChildren()
    }
}
