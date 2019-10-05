import { ratio, binarySearch, findex } from "../../core/Utils"
import { setByte, colorByte, getByte } from "../Utils/Utils"
import { GameEvent } from "../Utils/GameEvent"
import { DisplayObject, Sprite } from "pixi.js"
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
    calc?: (t: number) => number
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


function bezier(ctrl: [number, number, number, number]) {
    if (ctrl[0] < 0 || ctrl[0] > 1 || ctrl[2] < 0 || ctrl[2] > 1)
        console.warn("Unexpected control points of bezier curve")
    return function (t: number) {
        const t1 = 3 * t * (1 - t) * (1 - t)
        const t2 = 3 * t * t * (1 - t)
        const t3 = t * t * t
        return {
            x: ctrl[0] * t1 + ctrl[2] * t2 + t3,
            y: ctrl[1] * t1 + ctrl[3] * t2 + t3,
        }
    }
}

function CreateBezierCurve(ctrl: [number, number, number, number], precision = 0.1) {
    const points: Array<{ x: number, y: number }> = []
    const calc = bezier(ctrl)
    let t = 0
    while (t < 1) {
        points.push(calc(t))
        t += precision
    }
    points.push(calc(1))
    return function (x: number) {
        if (x < 0) x = 0
        if (x > 1) x = 1
        let i = 1;
        if (x <= 0) return points[0].y;
        if (x >= 1) return findex(points, -1).y
        i = binarySearch(id => points[id].x, points.length, x)
        return ratio(points[i].x, points[i + 1].x, x, points[i].y, points[i + 1].y)
    }
}

function CalcAnimation(anim: Animation, time: number) {
    if (anim.loop || anim.yoyo) {
        const t = Math.floor(time / anim.totaltime)
        time -= anim.totaltime * t
        if (anim.yoyo)
            if (t % 2) time = anim.totaltime - time
    }
    const list = anim.keyframes
    if (list.length === 0) {
        console.warn("Empty animation")
        return 0
    }
    const i = binarySearch(id => list[id].time, list.length, time)
    if (i === list.length - 1) return list[i].value
    if (i === -1) return list[0].value

    const start = list[i]
    const end = list[i + 1]
    switch (start.type) {
        case "static": return start.value
        case "linear": return ratio(start.time, end.time, time, start.value, end.value)
        case "bezier":
            if (!start.calc) start.calc = CreateBezierCurve(start.ctrl)
            const t = start.calc((time - start.time) / (end.time - start.time))
            return (end.value - start.value) * t + start.value
    }
}

export class AnimationManager {

    constructor(mapper?: (prop: string, value?: number) => void) {
        this.targetPropMapper = mapper
    }

    currentTime = 0
    targetPropMapper: (prop: string, value?: number) => void
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
        this.animations.forEach((anim, prop) => {
            const origvalue = CalcAnimation(anim, this.currentTime)
            const value = origvalue * (typeof anim.scale === "number" ? anim.scale : 1)
                + (typeof anim.base === "number" ? anim.base : 0)
            this.targetPropMapper(prop, value)
            if (!anim.loop && !anim.yoyo && this.currentTime >= anim.totaltime) endcount++;
        })
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

export function CreatePixiTargetPropMapper(obj: DisplayObject) {
    const s = obj as Sprite
    return function (prop: string, value: number) {
        switch (prop) {
            case "x":
            case "y":
            case "alpha":
            case "rotation":
            case "angle":
                obj[prop] = value
                break
            case "scale":
                obj.scale.set(value)
                break
            case "scalex":
                obj.scale.x = value
                break
            case "scaley":
                obj.scale.y = value
                break
            case "r":
            case "g":
            case "b":
                if (s.isSprite)
                    s.tint = setByte(s.tint, colorByte[prop], value)
        }
    }
}

export const keyFramePresets = {
    linear: {
        type: "linear",
        time: 0,
        value: 0
    } as Keyframe,
    easeInOUt: {
        type: "bezier",
        ctrl: [.42, 0, .58, 1],
        time: 0,
        value: 0,
    } as Keyframe,
    easeIn: {
        type: "bezier",
        ctrl: [.42, 0, 1, 1],
        time: 0,
        value: 0,
    } as Keyframe,
    easeOut: {
        type: "bezier",
        ctrl: [0, 0, .58, 1],
        time: 0,
        value: 0,
    } as Keyframe,
}

export function createSimpleAnimation(from: number, to: number, time: number, keyframe: Keyframe): Animation {
    return {
        keyframes: [keyframe, {
            type: "linear",
            time,
            value: 1
        }],
        totaltime: time,
        base: from,
        scale: (to - from),
    }
}
