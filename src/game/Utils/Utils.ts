
export function getByte(number: number, byte: number) {
    const off = (byte | 0) * 8
    const mask = 0xFF << off
    return (number & mask) >> off
}
export function setByte(number: number, byte: number, value: number) {
    const off = (byte | 0) * 8
    const v = (value & 0xFF) << off
    const imask = ~(0xFF << off)
    number = (number & imask) | v
    return number
}

export const colorByte = {
    r: 2,
    g: 1,
    b: 0,
}

export class ObjectPool<T> {
    private pool: T[] = []

    constructor(public newObj?: () => T, public beforeGet?: (o: T) => void | any, public beforeSave?: (o: T) => void | any) {
    }

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


export function addAutoListener<K extends keyof HTMLElementEventMap>
    (element: HTMLElement | Window, event: K, listener: (remove: () => void, ev: HTMLElementEventMap[K]) => any) {
    const wrap: any = (ev: HTMLElementEventMap[K]) => {
        const remove = () => element.removeEventListener(event, wrap)
        listener(remove, ev)
    }
    element.addEventListener(event, wrap)
    return () => element.removeEventListener(event, wrap)
}
