import { setItems } from "../../core/Utils"

type Listener<Args extends any[]> = (remove: () => void, ...args: Args) => any

export class GameEvent<Args extends any[] = any[]> {
    private listeners = new Set<Listener<Args>>()
    prevArgs: Args = (null as any) as Args

    emit(...args: Args) {
        const list = setItems(this.listeners)
        for (const listener of list) {
            listener(() => this.listeners.delete(listener), ...args)
        }
        this.prevArgs = args
    }

    add(listener: Listener<Args>) {
        this.listeners.add(listener)
    }
    remove(listener: Listener<Args>) {
        return this.listeners.delete(listener)
    }

    clear() {
        this.listeners.clear()
    }
}
