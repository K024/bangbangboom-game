
class AudioCtx {
  constructor() {
    this._ctx = new AudioContext()
    this._output = this._ctx.createGain()
    this._output.connect(this._ctx.destination)
  }
  private _ctx: AudioContext
  private _output: GainNode

  get ctx() { return this._ctx }
  get now() { return this._ctx.currentTime }
  get latency() { return this._ctx.baseLatency + this._ctx.outputLatency }
  get mastervolume() { return this._output.gain }
  get destination() { return this._output }
}

window.AudioContext = window.AudioContext || (window as any).webkitAudioContext

const globalctx = AudioContext && new AudioCtx()
export default globalctx