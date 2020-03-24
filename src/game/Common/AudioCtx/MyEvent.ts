
export type Listener<TArgs extends any[]> = (remove: () => boolean, ...args: TArgs) => unknown

export default class MyEvent<TArgs extends any[] = []> {
  private listeners = new Set<Listener<TArgs>>()

  add = (listener: Listener<TArgs>) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  dispatch = (...args: TArgs) => {
    const listeners: Listener<TArgs>[] = []
    for (const l of this.listeners) listeners.push(l)
    listeners.forEach(l => l(() => this.listeners.delete(l), ...args))
  }

  dispose = () => this.listeners.clear()
}
