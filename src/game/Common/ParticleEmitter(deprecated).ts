import { setByte, ObjectPool } from '../Utils/Utils'
import { GameEvent } from '../Utils/GameEvent'
import { Sprite, Texture, BLEND_MODES, ParticleContainer } from 'pixi.js'

type RangeNumber = {
    base: number
    offset: number
} | number

function getRangeValue(n?: RangeNumber) {
    if (n === undefined) return undefined
    if (typeof n === "number") return n
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

    constructor(texture: Texture, option: ParticleOption) {
        super(texture)
        this.setOption(option)
    }

    setOption(option: ParticleOption) {
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
        this.startX = getRangeValue(option.emitRect.x)
        this.startY = getRangeValue(option.emitRect.y)
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
                dvx += this.gravity.x * dt
                dvy += this.gravity.y * dt
            }
            if (this.accelTan) {
                dvx += this.accelTan * this.speedY * dt
                dvy += this.accelTan * -this.speedX * dt
            }
            if (this.accelRad) {
                dvx += this.accelRad * (this.x - this.startX) * dt
                dvy += this.accelRad * (this.y - this.startY) * dt
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

export class ParticleEmitter extends ParticleContainer {

    private pool = new ObjectPool<Particle>()
    private option: ParticleOption

    constructor(textures: Texture[], option: ParticleOption) {
        // super(undefined, { vertices: true, rotation: true, tint: true })
        super()
        this.option = option
        if (option.blend === "add")
            this.blendMode = BLEND_MODES.ADD
        this.pool.newObj = () => {
            const i = Math.floor(Math.random() * textures.length)
            return new Particle(textures[i], option)
        }
        this.pool.after = x => {
            const i = Math.floor(Math.random() * textures.length)
            x.texture = textures[i]
            x.setOption(option)
            x.currentTime = 0
            x.shouldRemove = false
            return x
        }
    }

    private destroyed = false
    private particles: Particle[] = []
    currentTime = 0
    private counter = 0
    /**
     * 
     * @param dt in seconds
     */
    update(dt: number) {
        this.currentTime += dt
        if (this.destroyed) {
            return
        }
        if (this.option.duration > 0 && this.currentTime >= this.option.duration) {
            if (!this._emitEnded) this.onEmitEnd.emit()
            this._emitEnded = true
        } else {
            this._emitEnded = false
        }
        if (this.option.duration <= 0 || this.currentTime < this.option.duration) {
            this.counter += dt * this.option.emissionRate
            while (this.counter > 1) {
                this.counter -= 1
                const p = this.pool.get()
                this.particles.push(p)
            }
        }
        this.particles.forEach(p => p.update(dt))
        {
            const stay: Particle[] = []
            this.particles.forEach(x => x.shouldRemove ? this.pool.save(x) : stay.push(x))
            this.particles = stay
            this.removeChildren()
            this.particles.forEach(x => this.addChild(x))

            if (this.particles.length <= 0 && this._emitEnded) {
                if (!this._end) this.onAllEnd.emit()
                this._end = true
            } else {
                this._end = false
            }
        }
    }

    onEmitEnd = new GameEvent<[]>()
    private _emitEnded = false
    onAllEnd = new GameEvent<[]>()
    private _end = false

    destroy() {
        this.destroyed = true
        this.removeChildren()
        this.pool.destroy()
    }
}
