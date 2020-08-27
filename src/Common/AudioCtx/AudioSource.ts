import globalctx from "./GlobalCtx"
import { AudioInstance } from "./index"

type Source = string | ArrayBuffer | Blob | Promise<ArrayBuffer | Blob>

export default class AudioSource {
    private constructor(buffer: AudioBuffer) {
        this.buffer = buffer
        this.gain = globalctx.ctx.createGain()
        this.gain.connect(globalctx.destination)
    }
    private gain: GainNode
    get destination() {
        return this.gain
    }
    get volume() {
        return Math.sqrt(this.gain.gain.value)
    }
    set volume(v) {
        this.gain.gain.value = v * v
    }

    buffer: AudioBuffer

    get duration() {
        if (this.buffer) {
            return this.buffer.duration
        }
        return 0
    }

    createInstance() {
        return new AudioInstance(this)
    }

    static from(getsource: (() => Source) | Source) {
        return new Promise<AudioSource>((res, rej) => {
            function load(data: ArrayBuffer | Blob) {
                if (data instanceof Blob) {
                    const reader = new FileReader()
                    reader.onabort = rej
                    reader.onerror = rej
                    reader.onload = e => (reader.result instanceof ArrayBuffer ? load(reader.result) : rej(e))
                    reader.readAsArrayBuffer(data)
                } else {
                    globalctx.ctx.decodeAudioData(data, buffer => res(new AudioSource(buffer)), rej)
                }
            }
            const src = getsource instanceof Function ? getsource() : getsource
            if (typeof src === "string") {
                fetch(src)
                    .then(x => x.arrayBuffer())
                    .then(load)
                    .catch(rej)
            } else if (src instanceof Promise) {
                src.then(load).catch(rej)
            } else {
                load(src)
            }
        })
    }
}
