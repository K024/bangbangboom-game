import { GameEvent } from "./GameEvent"
import { LoaderResource, Container, Sprite } from "pixi.js"
import { injectable } from "inversify"
import { GameConfig, staytime, GameLoadConfig } from "../Core/GameConfig"
import { JudgePoint } from "../Core/GameMap"
import { projection } from "../Core/Projection"
import { LaneCenterXs } from "../Core/Constants"

export class MainStage extends Container { }

export class GlobalEvents {
    /** delta, time in seconds */
    Update = new GameEvent<[number, number]>()
    /** width, height */
    Resize = new GameEvent<[number, number]>()
    WindowBlur = new GameEvent<[]>()
    WindowFocus = new GameEvent<[]>()
    End = new GameEvent<[]>()
}

export class Resources {
    [key: string]: LoaderResource
}

@injectable()
export class NoteHelper {
    static noteInitScale = 0.7
    constructor(config: GameConfig) {
        this.staytime = staytime(config.speed)
        this.noteScale = NoteHelper.noteInitScale * config.noteScale
    }

    noteScale: number
    staytime: number

    /** pre-multiplied config note scale */
    calc(note: JudgePoint, musicTime: number) {
        const dt = musicTime - note.time
        const t = dt / this.staytime
        return projection(t, LaneCenterXs[note.lane])
    }

    setScale(note: Sprite, scale: number) {
        note.scale.set(scale * this.noteScale)
    }
}

