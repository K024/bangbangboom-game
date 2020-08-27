import MyEvent from "./MyEvent"

/* eslint-disable @typescript-eslint/no-unused-vars */

export default class AudioElInstance {
    constructor(src: string) {
        this.el = document.createElement("audio")
        this.el.oncanplaythrough = e => {
            this.el.oncanplaythrough = null
            this._loaded = true
            this.onload.dispatch()
        }
        this.el.onerror = e => this.onloaderr.dispatch(e)
        ;(this.el as any).preservesPitch = true
        this.el.onended = e => {
            this.onend.dispatch()
            this.el.currentTime = 0
        }
        this.el.src = src
        this.el.load()
    }

    private _loaded = false
    get loaded() {
        return this._loaded
    }
    onload = new MyEvent()
    onloaderr = new MyEvent<[any]>()

    get duration() {
        return this.el.duration
    }

    private el: HTMLAudioElement

    get volume() {
        return this.el.volume
    }
    set volume(v) {
        this.el.volume = v
    }

    onplay = new MyEvent()
    onpause = new MyEvent()
    onseek = new MyEvent()
    onend = new MyEvent()

    get position() {
        return this.el.currentTime
    }

    play(delay = 0) {
        this.el.play()
        this.onplay.dispatch()
        return this
    }

    stop(delay = 0) {
        this.el.pause()
        this.el.currentTime = 0
        this.onend.dispatch()
        return this
    }

    pause(delay = 0) {
        this.el.pause()
        this.onpause.dispatch()
        return this
    }

    seek(position: number) {
        this.el.currentTime = position
        this.onseek.dispatch()
        return this
    }

    get rate() {
        return this.el.playbackRate
    }

    setRate(rate: number) {
        rate = Math.max(0.25, Math.min(4, rate))
        this.el.playbackRate = rate
        return this
    }
}
