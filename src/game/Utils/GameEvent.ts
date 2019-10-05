

export class GameEvent<Args extends any[]> {

    private listeners: Array<(...args: Args) => any> = []
    private clearFlag = false
    prevArgs: Args = null as any as Args

    emit(...args: Args) {
        this.clearFlag = false
        let list = this.listeners.splice(0)
        this.listeners.length = 0
        list = list.filter(l => {
            try {
                return l(...args) !== "remove"
            } catch (error) {
                console.error(error)
                return false
            }
        })
        this.listeners = this.listeners.concat(list)
        if (this.clearFlag) this.listeners.length = 0
        this.prevArgs = args
    }

    /** a listener returns "remove" to remove itself from this event */
    add(listener: (...args: Args) => any) {
        this.listeners.push(listener)
    }
    remove(listener: (...args: Args) => void) {
        const index = this.listeners.indexOf(listener)
        if (index >= 0) this.listeners = this.listeners.splice(index, 1)
    }

    clear() {
        this.listeners.length = 0
        this.clearFlag = true
    }
}

