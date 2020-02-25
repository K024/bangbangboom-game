
export function findex<T>(list: T[], i: number): T {
    if (list.length <= 0) return undefined as any
    if (i >= list.length) return undefined as any
    if (i < -list.length) return undefined as any
    if (i < 0) i += list.length
    return list[i]
}

export function assert<T>(x: T): NonNullable<T> {
    if (x === undefined || x === null) throw new Error("Assertion of not null and undefined failed")
    return x as any
}

export function gard<T>(x: T, d: NonNullable<T>): NonNullable<T> {
    if (x === undefined || x === null) return d
    return x as any
}

/**
 * return the index of the largest element equal or smaller than target
 */
export function binarySearch(list: (i: number) => number, length: number, target: number) {
    let l = 0
    let r = length - 1
    if (length <= 0) return -1
    if (target < list(l)) return -1
    if (list(r) <= target) return r

    while (l < r - 1) {
        const m = ((l + r) / 2) | 0
        const v = list(m)
        if (target < v) r = m
        else if (v < target) l = m
        else return m
    }
    return l
}

export function ratio(start: number, end: number, target: number, from: number, to: number) {
    const r = (target - start) / (end - start)
    return (to - from) * r + from
}

export function setItems<T>(s: Set<T>) {
    const list: T[] = []
    for (const item of s) {
        list.push(item)
    }
    return list
}
