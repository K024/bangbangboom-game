import { injectable } from "inversify";
import { Resources, GlobalEvents } from "../Utils/SymbolClasses";
import { GameState } from "./GameState";
import { GameConfig } from "./GameConfig";

@injectable()
export class SoundManager {
    constructor(resources: Resources, private state: GameState, config: GameConfig, events: GlobalEvents) {
        const sounds = {
            perfect: resources.perfect.data,
            great: resources.great.data,
            good: resources.good.data,
            flick: resources.flick.data,
            long: resources.long.data,
            button: resources.button.data
        }

        const lastTime: { [prop: string]: number } = {}
        const play = (s: keyof typeof sounds) => {
            const now = performance.now()
            if (lastTime[s] && now - lastTime[s] < 10) return
            lastTime[s] = now
            sounds[s].play()
        }

        for (const prop in sounds) {
            sounds[(prop as keyof typeof sounds)].volume(config.effectVolume)
        }

        state.onJudge.add((note) => {
            if (state.ended) return "remove"

            if (note.judge === "miss") {
                if (note.type !== "single" && note.type !== "flick") {
                    //
                }
            } else if (note.judge !== "bad") {
                if (note.type === "flick" || note.type === "flickend") {
                    play("flick")
                } else {
                    play(note.judge as "perfect" | "great" | "good")
                }
            }
        })

        state.onEmptyTap.add(() => {
            if (state.ended) return "remove"

            play("button")
        })

        events.End.add(() => {

            for (const prop in sounds) {
                sounds[(prop as keyof typeof sounds)].unload()
            }
        })
    }
}


