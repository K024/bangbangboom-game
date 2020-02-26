import { injectable } from "inversify"
import { GameState, PointerEventInfo } from "./GameState"
import { Note, Slide, Flick, SlideAmong, SlideFlickEnd, SlideEnd, SlideStart } from "./GameMap"
import { GameConfig } from "./GameConfig"
import { JudgeOffset, Judge } from "./Constants"
import { findex, assert } from "../../core/Utils"

export abstract class AbsctractJudgeManager { }

const Getters = {
    single() { return JudgeOffset.typeA },
    flick() { return JudgeOffset.typeA },
    slidestart(note: SlideStart) {
        if (note.parent.long) return JudgeOffset.typeA
        return JudgeOffset.typeC
    },
    slideamong(note: SlideAmong) {
        if (!note.parent.pointerId) return JudgeOffset.typeC
        return JudgeOffset.typeE
    },
    slideend(note: SlideEnd) {
        if (!note.parent.pointerId) return JudgeOffset.typeA
        if (note.parent.long) return JudgeOffset.typeB
        return JudgeOffset.typeC
    },
    flickend(note: SlideFlickEnd) {
        if (!note.parent.pointerId) return JudgeOffset.typeA
        return JudgeOffset.typeD
    },
}
function getJudgeFunction(note: Note) {
    return Getters[note.type](note as any)
}

function slideNowJudge(note: SlideStart | SlideAmong | SlideEnd | SlideFlickEnd) {
    const i = note.parent.nextJudgeIndex || 0
    return note.parent.notes[i] === note
}

function distance2(p1: PointerEventInfo, p2: PointerEventInfo) {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    return dx * dx + dy * dy
}

@injectable()
export class JudgeManager extends AbsctractJudgeManager {
    constructor(state: GameState, config: GameConfig) {
        super()

        const list = state.map.notes

        let pool: Note[] = []

        const holdingSlides = new Map<number, {
            track: PointerEventInfo[],
            slide: Slide
        }>()
        const holdingFlicks = new Map<number, {
            note: Flick | SlideFlickEnd,
            start: PointerEventInfo
        }>()

        // --------------------------------------- Interval Judges ---------------------------------------

        let nextJudgeIndex = 0

        let lastMusicTime = 0

        const interval = () => {
            if (state.ended) return
            requestAnimationFrame(interval)
            if (state.paused) return

            const mt = state.GetMusicTime() + config.judgeOffset / 1000

            let i = nextJudgeIndex
            while (i < list.length && list[i].time <= mt + 0.3) {
                if (!list[i].judge)
                    pool.push(list[i])
                i++
            }
            nextJudgeIndex = i

            const judgedNotes = new Set<Note>()

            for (const x of pool) {
                // focus on notes can miss
                if (!(mt - x.time >= 0.1)) continue
                const j = getJudgeFunction(x)(mt - x.time)
                if (j === "miss") {
                    x.judge = j

                    if (x.type === "slidestart") {
                        x.parent.nextJudgeIndex = 1
                    } else if (x.type !== "single" && x.type !== "flick") {
                        x.parent.nextJudgeIndex!++
                        if (x.type !== "slideamong") {
                            holdingSlides.delete(x.parent.pointerId!)
                            holdingFlicks.delete(x.parent.pointerId!)
                            x.parent.pointerId = undefined
                        }
                    } else if (x.type === "flick") {
                        holdingFlicks.delete(x.pointerId!)
                        x.pointerId = undefined
                    }

                    state.onJudge.emit(x)
                    judgedNotes.add(x)
                }
            }

            if (judgedNotes.size > 0) {
                pool = pool.filter(x => !judgedNotes.has(x))
                judgedNotes.clear()
            }

            for (const s of pool) {
                // focus on slideamongs
                if (!(s.type === "slideamong" && s.parent.pointerId && slideNowJudge(s))) continue
                const j = getJudgeFunction(s)(mt - s.time)
                if (j === "perfect") { // this only indicates we can judge it now
                    const p = s.parent
                    const info = holdingSlides.get(p.pointerId!)
                    if (info) {
                        if (Math.abs(findex(info.track, -1).lane - s.lane) <= 1) { // todo: care about this
                            s.judge = j
                            p.nextJudgeIndex!++
                            state.onJudge.emit(s)
                            judgedNotes.add(s)
                        }
                    }
                }
            }

            if (judgedNotes.size > 0) {
                pool = pool.filter(x => !judgedNotes.has(x))
                judgedNotes.clear()
            }

            for (const [, x] of holdingFlicks) {
                // flicks that holds too long will miss
                const jt = x.note.type === "flick" ? x.start.time : x.note.time
                if (mt - jt > JudgeOffset.flickOutTime) {
                    x.note.judge = "miss"
                    if (x.note.type === "flickend") {
                        holdingSlides.delete(x.note.parent.pointerId!)
                        x.note.parent.pointerId = undefined
                        x.note.parent.nextJudgeIndex!++
                    }
                    holdingFlicks.delete(x.start.pointerId)
                    state.onJudge.emit(x.note)
                    judgedNotes.add(x.note)
                }
            }

            if (judgedNotes.size > 0) {
                pool = pool.filter(x => !judgedNotes.has(x))
                judgedNotes.clear()
            }

            for (const s of pool) {
                // focus on flickend which will turn to be able to judge
                if (!(s.type === "flickend" && !s.parent.long && s.parent.pointerId)) continue
                const func = getJudgeFunction(s)
                if (func(mt - s.time) === "perfect" && func(lastMusicTime - s.time) === undefined) {
                    const start = findex(assert(holdingSlides.get(s.parent.pointerId!)).track, -1)
                    if (Math.abs(start.lane - s.lane) <= 1) {
                        holdingFlicks.set(s.parent.pointerId!, {
                            note: s,
                            start
                        })
                    }
                }
            }

            for (const x of pool) {
                // miss for notes in slide that the next note is closer to judge line
                if ("parent" in x && x.type !== "slidestart") {
                    const index = (x.parent.nextJudgeIndex || 0) + 1
                    if (x.parent.notes[index] === x && mt >= x.time && lastMusicTime < x.time) {
                        const last = x.parent.notes[index - 1]
                        if (last.judge) continue
                        last.judge = "miss"
                        x.parent.nextJudgeIndex = index
                        state.onJudge.emit(last)
                        judgedNotes.add(last)
                    }
                }
            }

            if (judgedNotes.size > 0) {
                pool = pool.filter(x => !judgedNotes.has(x))
                judgedNotes.clear()
            }

            lastMusicTime = mt
        }

        requestAnimationFrame(interval)

        // --------------------------------------- Pointer Events ---------------------------------------

        state.onPointer.add((remove, pointer) => {
            if (state.ended) return remove()
            if (state.paused) return

            const mt = state.GetMusicTime() + config.judgeOffset / 1000
            pointer.time = mt

            const comparator = (l: Note, r: Note) => {
                const dt = Math.abs(l.time - mt) - Math.abs(r.time - mt)
                if (dt) return dt
                return Math.abs(l.lane - pointer.lane) - Math.abs(r.lane - pointer.lane)
            }

            const judgedNotes = new Set<Note>()

            let downHandled = false

            switch (pointer.type) {
                case "down": {
                    if (pointer.lane < 0) break
                    let canDown = pool.filter(x => {
                        if (Math.abs(x.lane - pointer.lane) > 1) return false
                        if ("parent" in x && !slideNowJudge(x)) return false
                        // holding flicks
                        if (x.type === "flick" && x.pointerId) return false
                        // holding slide notes
                        if ((x.type === "slideamong" || x.type === "slideend" || x.type === "flickend")
                            && x.parent.pointerId) return false
                        return true
                    })
                    if (canDown.length <= 0) break
                    canDown = canDown.sort(comparator)
                    const n = canDown[0]
                    const j = getJudgeFunction(n)(mt - n.time)
                    if (j !== undefined) {
                        downHandled = true
                        if (n.type !== "flick" && n.type !== "flickend") {
                            n.judge = j

                            if (n.type === "slidestart" || n.type === "slideamong") {
                                n.parent.pointerId = pointer.pointerId
                                if (!n.parent.nextJudgeIndex) n.parent.nextJudgeIndex = 0
                                n.parent.nextJudgeIndex++
                                holdingSlides.set(pointer.pointerId, {
                                    track: [pointer],
                                    slide: n.parent
                                })
                                if (n.type === "slidestart" && n.parent.long && n.parent.flickend) {
                                    holdingFlicks.set(pointer.pointerId, {
                                        note: n.parent.notes[1] as SlideFlickEnd,
                                        start: pointer
                                    })
                                }
                            } else if (n.type === "slideend") {
                                n.parent.nextJudgeIndex!++
                                n.parent.pointerId = undefined
                            }

                            state.onJudge.emit(n)
                            judgedNotes.add(n)
                        } else {
                            holdingFlicks.set(pointer.pointerId, {
                                note: n,
                                start: pointer
                            })
                            if (n.type === "flick") n.pointerId = pointer.pointerId
                        }
                    }
                    break
                }
                case "up": {
                    const f = holdingFlicks.get(pointer.pointerId)
                    const s = holdingSlides.get(pointer.pointerId)
                    if (f) {
                        f.note.judge = "miss"
                        if (f.note.type === "flickend") {
                            f.note.parent.pointerId = undefined
                            f.note.parent.nextJudgeIndex!++
                        }
                        judgedNotes.add(f.note)
                        state.onJudge.emit(f.note)
                    } else if (s) {
                        const n = s.slide.notes[s.slide.nextJudgeIndex!]
                        if (n) {
                            n.parent.pointerId = undefined
                            n.parent.nextJudgeIndex!++
                            if (n.type === "slideamong" || n.type === "flickend") {
                                n.judge = "miss"
                            } else if (n.type === "slideend") {
                                let j = getJudgeFunction(n)(mt - n.time) as Judge
                                if (j === undefined || Math.abs(pointer.lane - n.lane) > 1) j = "miss"
                                n.judge = j
                            }
                            judgedNotes.add(n)
                            state.onJudge.emit(n)
                        }
                    }
                    holdingSlides.delete(pointer.pointerId)
                    holdingFlicks.delete(pointer.pointerId)
                    break
                }
                case "move": {
                    const pointerHis = holdingSlides.get(pointer.pointerId)
                    if (pointerHis) pointerHis.track.push(pointer)
                    const f = holdingFlicks.get(pointer.pointerId)
                    if (f) {
                        if (distance2(f.start, pointer) > JudgeOffset.flickOutDis * JudgeOffset.flickOutDis) {
                            const jt = f.note.type === "flick" ? f.start.time : mt
                            const j = getJudgeFunction(f.note)(jt - f.note.time)
                            if (j !== undefined) {
                                if (f.note.type === "flickend") {
                                    f.note.parent.pointerId = undefined
                                    f.note.parent.nextJudgeIndex!++
                                }
                                f.note.judge = j
                                judgedNotes.add(f.note)
                                state.onJudge.emit(f.note)
                                holdingSlides.delete(pointer.pointerId)
                                holdingFlicks.delete(pointer.pointerId)
                            }
                        }
                    }
                    break
                }
            }

            if (judgedNotes.size > 0) {
                pool = pool.filter(x => !judgedNotes.has(x))
                judgedNotes.clear()
            }

            if (pointer.type === "down" && !downHandled) {
                if (pointer.lane !== -1)
                    state.onEmptyTap.emit(pointer.lane)
            }

        })

    }
}

