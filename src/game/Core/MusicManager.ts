import { injectable } from "inversify"
import { GameState } from "./GameState"
import { Resources, GlobalEvents } from "../Utils/SymbolClasses"
import { findex } from "../../core/Utils"
import { GameConfig } from "./GameConfig"
import { AudioSource, AudioInstance } from "../Common/AudioCtx"

@injectable()
export class MusciManager {
    constructor(state: GameState, resources: Resources, events: GlobalEvents, config: GameConfig) {
        const musicSource = resources.music.data as AudioSource
        const music = new AudioInstance(musicSource)

        let endPadding = Math.max(4 - musicSource.duration + (findex(state.map.notes, -1)?.time || 0), 0)

        music.onend.add((remove) => {
            remove()
            events.Update.add((remove, dt) => {
                if (state.ended) return remove()
                if (state.paused) return
                endPadding -= dt
                if (endPadding < 0) {
                    state.on.end.emit()
                    remove()
                }
            })
        })

        const padding = Math.min(state.musicTime, -1)

        state.GetMusicTime = () => music.position

        music.play(-padding)

        events.Update.add((remove) => {
            if (state.ended) return remove()
            if (state.paused) return

            const mt = music.position

            state.on.musicTimeUpdate.emit({
                musicTime: mt,
                visualTime: mt + config.visualOffset / 1000,
                judgeTime: mt + config.judgeOffset / 1000
            })
        })

        events.WindowBlur.add(() => {
            if (!state.paused)
                state.on.pause.emit()
        })

        state.on.pause.add(() => {
            music.pause()
        })

        state.on.continue.add(() => {
            music.play()
        })

        state.on.musicTimeUpdate.add((remove, mt) => {
            if (state.on.musicTimeUpdate.prevArgs)
                if (state.on.musicTimeUpdate.prevArgs[0] === mt)
                    console.warn("no use music time update:", mt)
        })

        events.End.add(() => {
            music.stop()
        })

    }
}

