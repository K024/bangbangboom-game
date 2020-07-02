import { injectable } from "inversify"
import { Resources, GlobalEvents } from "../Utils/SymbolClasses"
import { GameState } from "./GameState"
import { GameConfig } from "./GameConfig"
import { AudioSource, AudioInstance } from "../Common/AudioCtx"
import { setItems } from "../../core/Utils"

@injectable()
export class SoundManager {
    constructor(resources: Resources, private state: GameState, config: GameConfig, events: GlobalEvents) {
        const sounds: { [k: string]: AudioSource } = {
            perfect: resources.perfect.data,
            great: resources.great.data,
            good: resources.good.data,
            flick: resources.flick.data,
            button: resources.button.data,
        }

        for (const prop in sounds) {
            sounds[prop as keyof typeof sounds].volume = config.effectVolume
        }

        const toStop = new Set<AudioInstance>()

        const play = (s: keyof typeof sounds, delay: number) => {
            const au = new AudioInstance(sounds[s])
            if (!au) {
                console.warn("No such sound named " + s)
                return
            }
            au.onend.add(() => toStop.delete(au))
            au.play(delay)
            toStop.add(au)
        }

        state.on.soundEffect.add((remove, type, delay) => {
            if (state.ended) return remove()

            play(type, delay)
        })

        const clear = () => {
            const list = setItems(toStop)
            for (const au of list) au.stop()
            toStop.clear()
        }

        state.on.pause.add(clear)

        state.on.emptyTap.add(remove => {
            if (state.ended) return remove()

            play("button", 0)
        })

        events.End.add(clear)
    }
}
