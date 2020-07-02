import { ratio, createBinarySearch, setByte } from "../../Utils/Utils"
import { GameEvent } from "../GameEvent"
import { DisplayObject, Sprite } from "pixi.js"
import { CreateBezierCurve } from "./BezierCurve"

export type TimeValuePair = {
    time: number
    value: number
}

export type StaticKeyframe = {
    type: "static"
} & TimeValuePair

export type LinearKeyframe = {
    type: "linear"
} & TimeValuePair

export type BezierKeyframe = {
    type: "bezier"
    ctrl: [number, number, number, number]
} & TimeValuePair

export type Keyframe = StaticKeyframe | LinearKeyframe | BezierKeyframe

export type Animation = {
    keyframes: Keyframe[]
    base?: number
    scale?: number
    totaltime: number
    loop?: boolean
    yoyo?: boolean
}

const WarnedAnim = new WeakMap()
const bezierCalc = new WeakMap<object, (t: number) => number>()

const binarySearchTime = createBinarySearch((lname, iname) => `${lname}[${iname}].time`)

function CalcAnimation(anim: Animation, time: number) {
    if (anim.loop || anim.yoyo) {
        const t = (time / anim.totaltime) | 0
        time -= anim.totaltime * t
        if (anim.yoyo && t % 2) time = anim.totaltime - time
    }
    const list = anim.keyframes
    if (list.length === 0) {
        if (!WarnedAnim.get(anim)) {
            WarnedAnim.set(anim, 1)
            console.warn("Empty animation")
        }
        return 0
    }
    const i = binarySearchTime(list, time)
    if (i === list.length - 1) return list[i].value
    if (i === -1) return list[0].value

    const start = list[i]
    const end = list[i + 1]
    switch (start.type) {
        case "static":
            return start.value
        case "linear":
            return ratio(start.time, end.time, time, start.value, end.value)
        case "bezier": {
            let calc = bezierCalc.get(start.ctrl)
            if (!calc) {
                calc = CreateBezierCurve(start.ctrl)
                bezierCalc.set(start.ctrl, calc)
            }
            const t = calc((time - start.time) / (end.time - start.time))
            return (end.value - start.value) * t + start.value
        }
    }
}

export type PropertySetter = { [prop: string]: (v: number) => void }

export class AnimationManager {
    constructor(setter?: PropertySetter) {
        this.propSetter = setter
    }

    currentTime = 0
    propSetter?: PropertySetter
    animations = new Map<string, Animation>()
    onEnd = new GameEvent<[]>()
    paused = false
    /**
     * @param dt in seconds
     */
    update(dt: number) {
        if (this.paused) return
        this.currentTime += dt
        let endcount = 0
        if (this.propSetter) {
            for (const [prop, anim] of this.animations) {
                const origvalue = CalcAnimation(anim, this.currentTime)
                const value =
                    origvalue * (typeof anim.scale === "number" ? anim.scale : 1) +
                    (typeof anim.base === "number" ? anim.base : 0)
                if (this.propSetter[prop]) this.propSetter[prop](value)
                if (!anim.loop && !anim.yoyo && this.currentTime >= anim.totaltime) endcount++
            }
        }
        if (endcount === this.animations.size) {
            if (!this._ended) this.onEnd.emit()
            this._ended = true
        } else {
            this._ended = false
        }
    }
    private _ended = false

    get ended() {
        return this._ended
    }
}

export function CreatePixiPropSetter(obj: DisplayObject): PropertySetter {
    const s = obj as Sprite
    return {
        x: v => (s.x = v),
        y: v => (s.y = v),
        alpha: v => (s.alpha = v),
        rotation: v => (s.rotation = v),
        angle: v => (s.angle = v),
        scale: v => s.scale.set(v),
        scalex: v => (s.scale.x = v),
        scaley: v => (s.scale.y = v),
        r: v => (s.tint = setByte(s.tint, 2, v)),
        g: v => (s.tint = setByte(s.tint, 1, v)),
        b: v => (s.tint = setByte(s.tint, 0, v)),
    }
}

export const keyFramePresets = {
    linear: {
        type: "linear",
        time: 0,
        value: 0,
    } as Keyframe,
    easeInOUt: {
        type: "bezier",
        ctrl: [0.42, 0, 0.58, 1],
        time: 0,
        value: 0,
    } as Keyframe,
    easeIn: {
        type: "bezier",
        ctrl: [0.42, 0, 1, 1],
        time: 0,
        value: 0,
    } as Keyframe,
    easeOut: {
        type: "bezier",
        ctrl: [0, 0, 0.58, 1],
        time: 0,
        value: 0,
    } as Keyframe,
}

export function createSimpleAnimation(from: number, to: number, time: number, keyframe: Keyframe): Animation {
    return {
        keyframes: [
            keyframe,
            {
                type: "linear",
                time,
                value: 1,
            },
        ],
        totaltime: time,
        base: from,
        scale: to - from,
    }
}
