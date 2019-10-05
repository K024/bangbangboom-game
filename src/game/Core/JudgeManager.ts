import { injectable } from "inversify";
import { GameState, PointerEventInfo } from "./GameState";
import { Note, Slide, Flick, SlideAmong, SlideFlickEnd, SlideEnd, SlideStart } from "./GameMap";
import { GameConfig } from "./GameConfig";
import { JudgeOffset, Judge } from "./Constants";
import { findex } from "../../core/Utils";

export abstract class AbsctractJudgeManager { }

function getJudgeFunction(note: Note) {
    if (note.type === "single") return JudgeOffset.typeA
    if (note.type === "flick") return JudgeOffset.typeA
    if (note.type === "slidestart") {
        if (note.parent.long) return JudgeOffset.typeA
        return JudgeOffset.typeC
    }
    if (note.type === "slideamong") {
        if (!note.parent.pointerId) return JudgeOffset.typeC
        return JudgeOffset.typeE
    }
    if (note.type === "slideend") {
        if (!note.parent.pointerId) return JudgeOffset.typeA
        if (note.parent.long) return JudgeOffset.typeB
        return JudgeOffset.typeC
    }
    if (note.type === "flickend") {
        if (!note.parent.pointerId) return JudgeOffset.typeA
    }
    return JudgeOffset.typeD
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

        let nextJudgeIndex = 0

        let lastMusicTime = 0

        // --------------------------------------- Interval Judges ---------------------------------------

        const interval = setInterval(() => {
            if (state.paused) return
            if (state.ended) {
                clearInterval(interval)
            }

            const mt = state.GetMusicTime() + config.judgeOffset / 1000

            let i = nextJudgeIndex
            while (i < list.length && list[i].time <= mt + 0.3) {
                if (!list[i].judge)
                    pool.push(list[i])
                i++
            }
            nextJudgeIndex = i

            const removeList: Note[] = []
            const ableToMiss = pool.filter(x => mt - x.time >= 0.1)
            ableToMiss.forEach(x => {
                const j = getJudgeFunction(x)(mt - x.time)
                if (j === "miss") {
                    x.judge = j

                    if (x.type === "slidestart") {
                        x.parent.nextJudgeIndex = 1
                    } else if (x.type !== "single" && x.type !== "flick") {
                        x.parent.nextJudgeIndex++
                        if (x.type !== "slideamong") {
                            holdingSlides.delete(x.parent.pointerId)
                            holdingFlicks.delete(x.parent.pointerId)
                            x.parent.pointerId = undefined
                        }
                    } else if (x.type === "flick") {
                        holdingFlicks.delete(x.pointerId)
                        x.pointerId = undefined
                    }

                    state.onJudge.emit(x)
                    removeList.push(x)
                }
            })

            if (removeList.length > 0) {
                pool = pool.filter(x => removeList.indexOf(x) < 0)
                removeList.length = 0
            }

            const slideAmongs = pool.filter(x => x.type === "slideamong" && x.parent.pointerId && slideNowJudge(x))
            slideAmongs.forEach(x => {
                const s = x as SlideAmong
                const j = getJudgeFunction(s)(mt - s.time)
                if (j === "perfect") { // this only indicates we can judge it now
                    const p = s.parent
                    const info = holdingSlides.get(p.pointerId)
                    if (info) {
                        if (Math.abs(findex(info.track, -1).lane - s.lane) <= 1) { // todo: care about this
                            s.judge = j
                            p.nextJudgeIndex++
                            state.onJudge.emit(s)
                            removeList.push(x)
                        }
                    }
                }
            })

            if (removeList.length > 0) {
                pool = pool.filter(x => removeList.indexOf(x) < 0)
                removeList.length = 0
            }

            const hodingfs: Array<{ note: Flick | SlideFlickEnd, start: PointerEventInfo }> = []
            holdingFlicks.forEach(x => hodingfs.push(x))
            hodingfs.forEach(x => {
                const jt = x.note.type === "flick" ? x.start.time : x.note.time
                if (mt - jt > JudgeOffset.flickOutTime) {
                    x.note.judge = "miss"
                    if (x.note.type === "flickend") {
                        holdingSlides.delete(x.note.parent.pointerId)
                        x.note.parent.pointerId = undefined
                        x.note.parent.nextJudgeIndex++
                    }
                    holdingFlicks.delete(x.start.pointerId)
                    state.onJudge.emit(x.note)
                    removeList.push(x.note)
                }
            })

            if (removeList.length > 0) {
                pool = pool.filter(x => removeList.indexOf(x) < 0)
                removeList.length = 0
            }

            const flickEnd = pool.filter(x => x.type === "flickend" && !x.parent.long && x.parent.pointerId)
            flickEnd.forEach(x => {
                const func = getJudgeFunction(x)
                if (func(mt - x.time) === "perfect" && func(lastMusicTime - x.time) === undefined) {
                    const s = x as SlideFlickEnd
                    const start = findex(holdingSlides.get(s.parent.pointerId).track, -1)
                    if (Math.abs(start.lane - s.lane) <= 1) {
                        holdingFlicks.set(s.parent.pointerId, {
                            note: s,
                            start
                        })
                    } else {
                        holdingSlides.delete(s.parent.pointerId)
                        s.parent.pointerId = undefined
                        s.parent.nextJudgeIndex++
                        s.judge = "miss"
                        state.onJudge.emit(s)
                        removeList.push(s)
                    }
                }
            })

            if (removeList.length > 0) {
                pool = pool.filter(x => removeList.indexOf(x) < 0)
                removeList.length = 0
            }

            pool.forEach(x => {
                if ("parent" in x && x.type !== "slidestart") {
                    const index = (x.parent.nextJudgeIndex || 0) + 1
                    if (x.parent.notes[index] === x && mt >= x.time && lastMusicTime < x.time) {
                        const last = x.parent.notes[index - 1]
                        if (last.judge) return
                        last.judge = "miss"
                        x.parent.nextJudgeIndex = index
                        state.onJudge.emit(last)
                        removeList.push(last)
                    }
                }
            })

            if (removeList.length > 0) {
                pool = pool.filter(x => removeList.indexOf(x) < 0)
                removeList.length = 0
            }

            lastMusicTime = mt
        })

        // --------------------------------------- Pointer Events ---------------------------------------

        state.onPointer.add(pointer => {
            if (state.ended) return "remove"
            if (state.paused) return

            const mt = state.GetMusicTime() + config.judgeOffset / 1000
            pointer.time = mt

            const comparator = (l: Note, r: Note) => {
                const dt = Math.abs(l.time - mt) - Math.abs(r.time - mt)
                if (dt) return dt
                return Math.abs(l.lane - pointer.lane) - Math.abs(r.lane - pointer.lane)
            }

            const removeList: Note[] = []

            let downHandled = false

            switch (pointer.type) {
                case "down": {
                    if (pointer.lane < 0) break
                    let canDown = pool.filter(x => {
                        if (Math.abs(x.lane - pointer.lane) > 1) return false
                        if ("parent" in x && !slideNowJudge(x)) return false
                        if (x.type === "flick" && x.pointerId) return false
                        if ((x.type === "slideamong" || x.type === "slideend" || x.type === "flickend") && x.parent.pointerId) return false
                        return true
                    })
                    if (canDown.length <= 0) break
                    canDown = canDown.sort(comparator) // can be optimised by heap
                    const n = canDown[0]
                    const j = getJudgeFunction(n)(mt - n.time)
                    if (j !== undefined) {
                        if (n.type !== "flick" && n.type !== "flickend") {
                            downHandled = true
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
                                n.parent.nextJudgeIndex++
                                n.parent.pointerId = undefined
                            }

                            state.onJudge.emit(n)
                            removeList.push(n)
                        } else {
                            downHandled = true
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
                            f.note.parent.nextJudgeIndex++
                        }
                        removeList.push(f.note)
                        state.onJudge.emit(f.note)
                    } else if (s) {
                        const n = s.slide.notes[s.slide.nextJudgeIndex]
                        if (n) {
                            if (n.type === "slideamong" || n.type === "flickend") {
                                n.parent.pointerId = undefined
                                n.parent.nextJudgeIndex++
                                n.judge = "miss"
                                removeList.push(n)
                                state.onJudge.emit(n)
                            } else if (n.type === "slideend") {
                                let j = getJudgeFunction(n)(mt - n.time) as Judge
                                if (j === undefined || Math.abs(pointer.lane - n.lane) > 1) j = "miss"
                                n.judge = j
                                n.parent.pointerId = undefined
                                n.parent.nextJudgeIndex++
                                removeList.push(n)
                                state.onJudge.emit(n)
                            }
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
                                    f.note.parent.nextJudgeIndex++
                                }
                                f.note.judge = j
                                removeList.push(f.note)
                                state.onJudge.emit(f.note)
                                holdingSlides.delete(pointer.pointerId)
                                holdingFlicks.delete(pointer.pointerId)
                            }
                        }
                    }
                    break
                }
            }

            if (removeList.length > 0) {
                pool = pool.filter(x => removeList.indexOf(x) < 0)
                removeList.length = 0
            }

            if (pointer.type === "down" && !downHandled) {
                if (pointer.lane !== -1)
                    state.onEmptyTap.emit(pointer.lane)
            }

        })

    }
}

