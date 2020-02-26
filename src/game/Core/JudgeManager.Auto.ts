import { injectable } from "inversify"
import { AbsctractJudgeManager } from "./JudgeManager"
import { GameState } from "./GameState"

@injectable()
export class AutoJudgeManager extends AbsctractJudgeManager {
    constructor(state: GameState) {
        super()

        let nextJudgeIndex = 0

        const list = state.map.notes

        let timeoutOffset = 0

        const animloop = () => {
            if (state.ended) return
            requestAnimationFrame(animloop)
            if (state.paused) return

            const time = state.GetMusicTime() + 0.05
            let i = nextJudgeIndex

            while (i < list.length && list[i].time < time) {
                const note = list[i]
                note.judge = "perfect"
                if (note.type === "slidestart") {
                    note.parent.pointerId = 1
                    note.parent.nextJudgeIndex = 1
                } else if (note.type === "slideamong") {
                    note.parent.nextJudgeIndex!++
                } else if (note.type === "slideend" || note.type === "flickend") {
                    note.parent.pointerId = 0
                }
                setTimeout(() => {
                    state.onJudge.emit(note)
                    const offset = state.GetMusicTime() - note.time
                    timeoutOffset = timeoutOffset * 0.9 + offset * 0.01
                }, time - note.time - timeoutOffset)
                i++
            }
            nextJudgeIndex = i
        }

        requestAnimationFrame(animloop)
    }
}

