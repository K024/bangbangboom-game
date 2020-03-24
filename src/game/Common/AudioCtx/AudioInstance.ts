import AudioSource from "./AudioSource"
import globalctx from "./GlobalCtx"
import MyEvent from "./MyEvent"

export default class AudioInstance {
  constructor(source: AudioSource) {
    this.source = source
    this.gain = globalctx.ctx.createGain()
    this.gain.connect(source.destination)
    this.node = this.createnode()
  }
  source: AudioSource

  private gain: GainNode
  get volume() { return Math.sqrt(this.gain.gain.value) }
  set volume(v) { this.gain.gain.value = v * v }

  private node: AudioBufferSourceNode
  private createnode() {
    const n = globalctx.ctx.createBufferSource()
    n.buffer = this.source.buffer as AudioBuffer
    n.connect(this.gain)
    n.playbackRate.value = this._playbackrate
    return n
  }
  private _playing = false
  /**
   * when sound is playing, keep it valid to (now - starttime) * playbackrate == position
   * when not playing, it's not valid at all
   */
  private _starttime = 0
  /**
   * when sound is playing, it's not valid at all
   * when not playing, it shows where to start sound
   */
  private _startpos = 0
  private _playbackrate = 1

  onplay = new MyEvent()
  onpause = new MyEvent()
  onseek = new MyEvent()
  onend = new MyEvent()

  get position() {
    if (!this._playing) return this._startpos
    const now = globalctx.now
    const playedtime = now - this._starttime
    // if (this._playbackrate !== 1) return playedtime * this._playbackrate - 0.016
    return playedtime * this._playbackrate
  }

  /**
   * set startpos before calling it
   */
  private callstart = (delay: number) => {
    const startt = globalctx.now + delay
    this.node.start(startt, this._startpos)
    const playedtime = this._startpos / this._playbackrate
    this._starttime = startt - playedtime
    this._playing = true
  }

  private handleNormalEnd = () => {
    this._startpos = 0
    this._playing = false
    this.node = this.createnode()

    this.onend.dispatch()
  }

  private handlePauseEnd = () => {
    this._startpos = this.position  // get before _playing is set to false
    this._playing = false
    this.node = this.createnode()

    this.onpause.dispatch()
  }

  private handleSeekEnd = () => {

    this.node = this.createnode()
    this.node.onended = this.handleNormalEnd
    this.callstart(0)

    this.onseek.dispatch()
  }

  play(delay = 0) {
    if (this._playing) return

    this.callstart(delay)

    // normal end
    this.node.onended = this.handleNormalEnd

    this.onplay.dispatch()
  }

  stop(delay = 0) {
    if (!this._playing) {
      this._startpos = 0
      return
    }

    // normal end, maybe we have to override pause end handler
    this.node.onended = this.handleNormalEnd

    this.node.stop(globalctx.now + delay)
  }

  pause(delay = 0) {
    if (!this._playing) return

    // pause caused end
    this.node.onended = this.handlePauseEnd

    this.node.stop(globalctx.now + delay)
  }

  seek(position: number) {
    position = Math.max(0, Math.min(this.source.duration, position))
    if (!this._playing) {
      this._startpos = position
      this.onseek.dispatch()
      return
    }

    this._startpos = position
    const playedtime = this._startpos / this._playbackrate
    this._starttime = globalctx.now - playedtime
    // seek caused end
    this.node.onended = this.handleSeekEnd

    this.node.stop(globalctx.now)
  }

  get rate() { return this._playbackrate }

  setRate(rate: number) {
    rate = Math.max(0.25, Math.min(4, rate))

    const currentpos = this.position // get currentpos before set playbackrate

    this._playbackrate = rate
    this.node.playbackRate.value = this._playbackrate

    if (this._playing) {
      const now = globalctx.now
      const playedtime = currentpos / rate
      this._starttime = now - playedtime
    }
  }
}

