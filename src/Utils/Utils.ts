export function findex<T>(list: T[], i: number): T {
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

export function createBinarySearch<T>(
    getItem: (listName: string, indexName: string) => string
): (list: T[], target: number) => number {
    /**
     * return the index of the largest element equal or smaller than target
     */
    return new Function(
        "list",
        "target",
        `
        let length = list.length
        if (length <= 0) return -1
        let l = 0
        let r = length - 1
        if (target < ${getItem("list", "l")}) return -1
        if (${getItem("list", "r")} <= target) return r

        while (l < r - 1) {
            const m = ((l + r) / 2) | 0
            const v = ${getItem("list", "m")}
            if (target < v) r = m
            else if (v < target) l = m
            else return m
        }
        return l`
    ) as any
}

export function ratio(start: number, end: number, target: number, from: number, to: number) {
    const r = (target - start) / (end - start)
    return (to - from) * r + from
}

export function setItems<T>(s: Set<T>) {
    const list: T[] = []
    let i = 0
    for (const item of s) {
        list[i++] = item
    }
    return list
}

export function getByte(number: number, byte: number) {
    const off = (byte | 0) * 8
    const mask = 0xff << off
    return (number & mask) >> off
}
export function setByte(number: number, byte: number, value: number) {
    const off = (byte | 0) * 8
    const v = (value & 0xff) << off
    const imask = ~(0xff << off)
    number = (number & imask) | v
    return number
}

export const colorByte = {
    r: 2,
    g: 1,
    b: 0,
}

export class ObjectPool<T extends {} = {}> {
    private pool: T[] = []

    constructor(
        public newObj?: () => T,
        public beforeGet?: (o: T) => void | any,
        public beforeSave?: (o: T) => void | any
    ) {}

    get() {
        if (!this.newObj) throw new Error("Can not create new object")
        if (this.pool.length <= 0) {
            this.pool.push(this.newObj())
        }
        const v = this.pool.pop()!
        if (this.beforeGet) this.beforeGet(v)
        return v
    }

    save(o: T) {
        if (this.beforeSave) this.beforeSave(o)
        this.pool.push(o)
    }

    ensure(n: number) {
        if (!this.newObj) throw new Error("Can not create new object")
        while (this.pool.length < n) this.pool.push(this.newObj())
    }

    destroy() {
        this.pool.length = 0
    }
}

export function addAutoListener<K extends keyof HTMLElementEventMap>(
    element: HTMLElement | Window,
    event: K,
    listener: (remove: () => void, ev: HTMLElementEventMap[K]) => any
) {
    const wrap: any = (ev: HTMLElementEventMap[K]) => {
        const remove = () => element.removeEventListener(event, wrap)
        listener(remove, ev)
    }
    element.addEventListener(event, wrap)
    return () => element.removeEventListener(event, wrap)
}
