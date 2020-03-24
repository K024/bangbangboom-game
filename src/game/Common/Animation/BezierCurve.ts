import { ratio } from "../../../core/Utils"

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

const bezierSampleFuncCache = new Map<string, (x: number) => number>()
function bezierFuncId([c0, c1, c2, c3]: [number, number, number, number]) {
    c0 = (c0 * 1000) | 0
    c1 = (c1 * 1000) | 0
    c2 = (c2 * 1000) | 0
    c3 = (c3 * 1000) | 0
    return `${c0}:${c1}:${c2}:${c3}`
}

export function CreateBezierCurve(ctrl: [number, number, number, number]) {
    const id = bezierFuncId(ctrl)
    let fn = bezierSampleFuncCache.get(id)
    if (fn) return fn
    const points: { x: number, y: number }[] = []
    const calc = bezier(ctrl)
    for (let i = 0; i <= 10; i++)
        points[i] = calc(i / 10)
    const samples = new Float32Array(101)
    samples[0] = 0
    for (let i = 1; i < 100; i++) {
        const x = i / 100
        let pi = 0
        while (x > points[pi].x) pi++
        samples[i] = ratio(points[pi - 1].x, points[pi].x, x, points[pi - 1].y, points[pi].y)
    }
    samples[100] = 1
    fn = function (x: number) {
        if (x < 0) return 0
        if (x > 1) return 1
        const f = x * 100
        const a = f | 0
        const b = a + 1
        return samples[a] * (b - f) + samples[b] * (f - a)
    }
    bezierSampleFuncCache.set(id, fn)
    return fn
}
