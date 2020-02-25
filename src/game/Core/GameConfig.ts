import { RawMap } from "../../core/Map"

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
}

export class GameLoadConfig {
    musicSrc = ""
    mapContent = () => null as RawMap | Promise<RawMap> | null
    backgroundSrc = ""
    coverSrc = ""
    skin = ""
    songName = ""
    loadingMessages?: string[]
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

