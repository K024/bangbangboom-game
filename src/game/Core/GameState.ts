import { GameMap, FromString, Note } from "./GameMap";
import { injectable } from "inversify";
import { Resources } from "../Utils/SymbolClasses";
import { GameEvent } from "../Utils/GameEvent";
import { Judge } from "./Constants";
import { GameConfig } from "./GameConfig";

const scoremap = {
    perfect: 2000,
    great: 1000,
    good: 600,
    bad: 300,
    miss: 0
}

export type PointerEventInfo = { pointerId: number, time: number, lane: number, type: "down" | "up" | "move", x: number, y: number }

@injectable()
export class GameState {
    constructor(resources: Resources, config: GameConfig) {
        this.map = FromString(resources.map.data, config.mirror)
        this.musicTime = Math.min(-1, this.map.notes[0].time - 5)
        this.maxScore = (scoremap.perfect + 1 + scoremap.perfect + this.map.combo) * this.map.combo / 2

        this.onJudge.add((note) => {
            if (this.ended) return "remove"
            this.addJudge(note.judge)
        })

        this.onEnd.add(() => {
            this._ended = true
            this.onMusicTimeUpdate.clear()
            this.onPause.clear()
            this.onContinue.clear()
            this.onJudge.clear()
            this.onPointer.clear()
        })
        this.onPause.add(() => { this._paused = true })
        this.onContinue.add(() => { this._paused = false })
    }

    map: GameMap

    musicTime: number

    maxCombo = 0
    currentCombo = 0

    perfect = 0
    great = 0
    good = 0
    bad = 0
    miss = 0

    get paused() { return this._paused }
    get ended() { return this._ended }
    get score() { return Math.floor(this.currentScore * 1000000 / this.maxScore) }

    onMusicTimeUpdate = new GameEvent<[{ musicTime: number, visualTime: number, judgeTime: number }]>()
    onPointer = new GameEvent<[PointerEventInfo]>()
    onJudge = new GameEvent<[Note]>()
    onEmptyTap = new GameEvent<[number]>()
    onPause = new GameEvent<[]>()
    onContinue = new GameEvent<[]>()
    onFullCombo = new GameEvent<[]>()
    onEnd = new GameEvent<[]>()
    onRestart = new GameEvent<[]>()
    onAbort = new GameEvent<[]>()

    GetMusicTime = () => 0

    // -------------- private field ----------

    private maxScore = 0
    private currentScore = 0
    private _ended = false
    private _paused = false
    private judged = 0
    private bonus = 0

    private addJudge(j: Judge) {
        if (j === "perfect" || j === "great") {
            this.currentCombo++
            if (this.maxCombo < this.currentCombo)
                this.maxCombo = this.currentCombo
            if (this.currentCombo === this.map.combo)
                this.onFullCombo.emit()
        } else {
            this.currentCombo = 0
        }
        this.currentScore += scoremap[j] + this.currentCombo
        this[j]++
        this.judged++
        // if (this.judged === this.map.combo)
        //     this.onEnd.emit()
    }
}

