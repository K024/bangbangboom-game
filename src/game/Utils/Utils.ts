// tslint:disable: no-bitwise
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

    newObj: () => T
    pre?: (o: T) => T
    after?: (o: T) => T

    get() {
        if (this.pool.length <= 0) {
            this.pool.push(this.newObj())
        }
        const v = this.pool.pop()
        if (this.pre) return this.pre(v)
        return v
    }

    save(o: T) {
        if (this.after) this.pool.push(this.after(o))
        else this.pool.push(o)
    }

    ensure(n: number) {
        while (this.pool.length < n) this.pool.push(this.newObj())
    }

    destroy() {
        this.pool.length = 0
    }
}

/** a listener returns "remove" to remove itself from this.event */
export function addAutoListener<K extends keyof WindowEventMap>
    (element: HTMLElement | Window, event: K, listener: (ev: WindowEventMap[K]) => any) {
    const wrap = (ev: WindowEventMap[K]) => {
        if (listener(ev) === "remove") element.removeEventListener(event, wrap)
    }
    element.addEventListener(event, wrap)
}
