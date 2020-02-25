import { injectable } from "inversify"
import { GameState } from "./GameState"
import { Resources, GlobalEvents } from "../Utils/SymbolClasses"
import { findex } from "../../core/Utils"
import { GameConfig } from "./GameConfig"

@injectable()
export class MusciManager {
    constructor(state: GameState, resources: Resources, events: GlobalEvents, config: GameConfig) {
        const music = resources.music.data as Howl
        music.stop()
        const musicid = music.play()
        music.pause(musicid)
        music.seek(0, musicid)


        let endPadding = Math.max(4 - music.duration() + findex(state.map.notes, -1).time, 0)

        music.once("end", () => {
            events.Update.add((remove, dt) => {
                if (state.ended) return remove()
                if (state.paused) return
                endPadding -= dt
                if (endPadding < 0) {
                    state.onEnd.emit()
                    return remove()
                }
            })
        })

        let started = false

        let padding = Math.min(state.musicTime, -1)

        let lastMt = performance.now()
        let lastTime = performance.now()

        state.GetMusicTime = () => {
            let mt = music.seek(musicid) as number
            if (lastMt === mt) {
                const off = (performance.now() - lastTime) / 1000
                if (off < 0.03)
                    mt += off
            } else {
                lastMt = mt
                lastTime = performance.now()
            }
            return mt
        }

        events.Update.add((remove, dt) => {
            if (state.ended) return remove()
            if (state.paused) return

            let mt = 0
            if (!started) {
                padding += dt
                mt = padding
                if (padding >= 0) {
                    started = true
                    music.play(musicid)
                    mt = music.seek(musicid) as number
                }
            } else {
                mt = music.seek(musicid) as number
            }

            if (lastMt === mt) {
                const off = (performance.now() - lastTime) / 1000
                if (off < 0.03)
                    mt += off
            } else {
                lastMt = mt
                lastTime = performance.now()
            }

            state.onMusicTimeUpdate.emit({
                musicTime: mt,
                visualTime: mt + config.visualOffset / 1000,
                judgeTime: mt + config.judgeOffset / 1000
            })
        })

        events.WindowBlur.add(() => {
            state.onPause.emit()
        })

        state.onPause.add(() => {
            music.pause(musicid)
        })

        state.onContinue.add(() => {
            music.play(musicid)
        })

        state.onMusicTimeUpdate.add((remove, mt) => {
            if (state.onMusicTimeUpdate.prevArgs)
                if (state.onMusicTimeUpdate.prevArgs[0] === mt)
                    console.warn("no use music time update:", mt)
        })

        events.End.add(() => {
            music.stop()
            music.unload()
        })

    }
}

