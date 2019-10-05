import { injectable } from "inversify";
import { AbsctractJudgeManager } from "./JudgeManager";
import { GameState } from "./GameState";

@injectable()
export class AutoJudgeManager extends AbsctractJudgeManager {
    constructor(state: GameState) {
        super()

        let nextJudgeIndex = 0

        const list = state.map.notes

        const interval = setInterval(() => {
            if (state.paused) return
            if (state.ended) {
                clearInterval(interval)
            }

            const time = state.GetMusicTime()
            let i = nextJudgeIndex
            while (i < list.length && list[i].time < time) {
                const note = list[i]
                note.judge = "perfect"
                if (note.type === "slidestart") {
                    note.parent.pointerId = 1
                    note.parent.nextJudgeIndex = 1
                } else if (note.type === "slideamong") {
                    note.parent.nextJudgeIndex++
                } else if (note.type === "slideend" || note.type === "flickend") {
                    note.parent.pointerId = 0
                }
                state.onJudge.emit(note)
                i++
            }
            nextJudgeIndex = i
        })
    }
}

