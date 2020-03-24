import { GameMap, Note, fromRawMap } from "./GameMap"
import { injectable } from "inversify"
import { Resources } from "../Utils/SymbolClasses"
import { GameEvent } from "../Common/GameEvent"
import { Judge } from "./Constants"
import { GameConfig } from "./GameConfig"

const baseScore = {
    perfect: 10,
    great: 8,
    good: 5,
    bad: 2,
    miss: 0,
}

const lifeBonus = {
    perfect: 1,
    great: 0,
    good: -10,
    bad: -20,
    miss: -40,
}

const slideAmongLifeBonus = {
    perfect: 0,
    miss: -5,
}

function multiplier(life: number) {
    if (life > 90) return 10
    if (life > 80) return 9
    if (life > 60) return 8
    if (life > 30) return 6
    return 3
}
const initLife = 100
const maxScore = 1000000

export type PointerEventInfo = { pointerId: number, time: number, lane: number, type: "down" | "up" | "move", x: number, y: number }

@injectable()
export class GameState {
    constructor(resources: Resources, config: GameConfig) {
        this.map = fromRawMap(resources.map.data)
        if (config.mirror) {
            for (const n of this.map.notes)
                n.lane = 6 - n.lane
        }
        this.musicTime = Math.min(-1, (this.map.notes[0]?.time || 0) - 5)
        this.maxScore = this.map.combo * 100
        if (this.maxScore <= 0) {
            this.maxScore = 1
            this.map.combo = 1
        }

        this.on.judge.add((remove, note) => {
            if (this.ended) return remove()
            if (!note.judge) return
            this.addJudge(note.judge, note.type === "slideamong")
        })

        this.on.end.add(() => {
            this._ended = true
            for (const key in this.on) {
                (this.on as { [k: string]: GameEvent })[key].clear()
            }
        })
        this.on.pause.add(() => { this._paused = true })
        this.on.continue.add(() => { this._paused = false })
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
    get score() { return Math.round(this.currentScore * maxScore / this.maxScore) }

    on = {
        musicTimeUpdate: new GameEvent<[{ musicTime: number, visualTime: number, judgeTime: number }]>(),
        pointer: new GameEvent<[PointerEventInfo]>(),
        judge: new GameEvent<[Note]>(),
        /** [type, delay(in seconds)] */
        soundEffect: new GameEvent<[string, number]>(),
        emptyTap: new GameEvent<[number]>(),
        pause: new GameEvent<[]>(),
        continue: new GameEvent<[]>(),
        fullCombo: new GameEvent<[]>(),
        end: new GameEvent<[]>(),
        restart: new GameEvent<[]>(),
        abort: new GameEvent<[]>(),
    }

    GetMusicTime = () => 0

    // -------------- private field ----------

    private maxScore = 0
    private currentScore = 0
    private life = initLife
    private _ended = false
    private _paused = false

    private addJudge(j: Judge, isSlideAmong: boolean) {
        if (j === "perfect" || j === "great") {
            this.currentCombo++
            if (this.maxCombo < this.currentCombo)
                this.maxCombo = this.currentCombo
            if (this.currentCombo === this.map.combo)
                this.on.fullCombo.emit()
        } else {
            this.currentCombo = 0
        }
        this[j]++
        const base = baseScore[j]
        const lifeb = isSlideAmong ? slideAmongLifeBonus[j as "perfect"] : lifeBonus[j]
        if (lifeb === undefined) throw new Error("Slide among should be judged perfect or miss")
        this.life = Math.max(0, Math.min(initLife, this.life + lifeb))
        this.currentScore += base * multiplier(this.life)
    }
}

