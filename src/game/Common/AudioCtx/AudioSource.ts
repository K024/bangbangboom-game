import globalctx from "./GlobalCtx"
import MyEvent from "./MyEvent"

type Source = ArrayBuffer | Blob | Promise<ArrayBuffer | Blob>

export default class AudioSource {
  private constructor() {
    this.gain = globalctx.ctx.createGain()
    this.gain.connect(globalctx.destination)
  }
  private gain: GainNode
  get destination() { return this.gain }
  get volume() { return Math.sqrt(this.gain.gain.value) }
  set volume(v) { this.gain.gain.value = v * v }

  buffer?: AudioBuffer
  get loaded() { return !!this.buffer }

  onload = new MyEvent()
  onloaderr = new MyEvent<[any]>()

  get duration() {
    if (this.buffer) {
      return this.buffer.duration
    }
    return 0
  }

  static from(getsource: (() => Source) | Source) {
    const s = new AudioSource()

    const onerror = (err: any) => s.onloaderr.dispatch(err)

    const load = (data: ArrayBuffer | Blob) => {
      if (data instanceof Blob) {
        const reader = new FileReader()
        reader.onabort = onerror
        reader.onerror = onerror
        reader.onload = e => {
          if (reader.result instanceof ArrayBuffer) {
            load(reader.result)
          } else {
            onerror(e)
          }
        }
        reader.readAsArrayBuffer(data)
      } else {
        globalctx.ctx.decodeAudioData(data, buffer => {
          s.buffer = buffer
          s.onload.dispatch()
        }, onerror)
      }
    }
    s.load = () => {
      const src = getsource instanceof Function
        ? getsource() : getsource
      if (src instanceof Promise) {
        src.then(load).catch(onerror)
      } else {
        load(src)
      }
      return s
    }
    return s
  }

  load = () => this
}
