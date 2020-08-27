import ajv from "ajv"
import { RawMap } from "./RawMap"

const GameConfigValidate = ajv().compile({
    type: "object",
    properties: {
        judgeOffset: { type: "number" },
        visualOffset: { type: "number" },
        speed: { type: "number", minimum: 1, exclusiveMaximum: 12 },
        resolution: { type: "number", minimum: 0.1, maximum: 8 },
        noteScale: { type: "number", minimum: 0.01, maximum: 4 },
        barOpacity: { type: "number", minimum: 0, maximum: 1 },
        backgroundDim: { type: "number", minimum: 0, maximum: 1 },
        effectVolume: { type: "number", minimum: 0, maximum: 1 },
        showSimLine: { type: "boolean" },
        laneEffect: { type: "boolean" },
        mirror: { type: "boolean" },
        beatNote: { type: "boolean" },
        autoplay: { type: "boolean" },
        debug: { type: "boolean" },
    },
})

export class GameConfig {
    judgeOffset = 0
    visualOffset = 0
    speed = 10
    resolution = 2
    noteScale = 1
    barOpacity = 0.7
    backgroundDim = 0.7
    effectVolume = 1
    showSimLine = true
    laneEffect = true
    mirror = false
    beatNote = true
    autoplay = false
    // showTapOffset = true

    debug?: boolean = false

    static validate(config: unknown): GameConfig | undefined {
        if (GameConfigValidate(config)) return config as any
        console.error(GameConfigValidate.errors)
    }
}

const GameLoadConfigValidate = ajv().compile({
    type: "object",
    properties: {
        musicSrc: { type: "string", minLength: 1 },
        backgroundSrc: { type: "string", minLength: 1 },
        coverSrc: { type: "string", minLength: 1 },
        skin: { type: "string", minLength: 1 },
        songName: { type: "string" },
        loadingMessages: { type: "array", items: { type: "string" } },
    },
    required: ["musicSrc", "skin"],
})

type LazyRawMap = RawMap | Promise<RawMap>

export class GameLoadConfig {
    musicSrc = ""
    mapContent = null as LazyRawMap | (() => LazyRawMap) | null
    backgroundSrc = ""
    coverSrc = ""
    skin = ""
    songName = ""
    loadingMessages?: string[]

    static validate(config: unknown): GameLoadConfig | undefined {
        if (GameLoadConfigValidate(config)) {
            const mapContent = (config as any).mapContent
            if (mapContent && mapContent instanceof Object) return config as any
            console.error("invalid mapContent property", mapContent)
            return
        }
        console.error(GameLoadConfigValidate.errors)
    }
}

export const jsonNames = {
    effect: "effect.json",
    game: "game.json",
    ui: "ui.json",
}

export const soundNames = {
    flick: "flick.mp3",
    button: "game_button.mp3",
    good: "good.mp3",
    great: "great.mp3",
    long: "long.mp3",
    perfect: "perfect.mp3",
}

export function staytime(speed: number) {
    return 5.5 - (speed - 1) / 2
}
