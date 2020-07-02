import * as RawMap from "./RawMap"
import { findex } from "../Utils/Utils"
import { Judge } from "./Constants"

export type JudgePoint = {
    /** real time from music start */
    time: number
    /** the first on the left is 0 */
    lane: number

    // judgeType?: {
    //     canDown: () => boolean
    //     canUp: () => boolean
    // }
    judge?: Judge
}

export type Single = {
    type: "single"
    onbeat: boolean
} & JudgePoint

export type Flick = {
    type: "flick"
    pointerId?: number
} & JudgePoint

export type Slide = {
    type: "slide"
    flickend: boolean
    long?: boolean
    nextJudgeIndex?: number
    pointerId?: number
    notes: Array<SlideStart | SlideAmong | SlideEnd | SlideFlickEnd>
}

export type SlideStart = {
    type: "slidestart"
    parent: Slide
} & JudgePoint

export type SlideAmong = {
    type: "slideamong"
    parent: Slide
} & JudgePoint

export type SlideEnd = {
    type: "slideend"
    parent: Slide
} & JudgePoint

export type SlideFlickEnd = {
    type: "flickend"
    parent: Slide
} & JudgePoint

export type SimLine = {
    type: "simline"
    left: JudgePoint
    right: JudgePoint
}

export type SlideBar = {
    type: "slidebar"
    start: SlideStart | SlideAmong
    end: SlideAmong | SlideEnd | SlideFlickEnd
}

export type MainNote = Single | Flick | SlideStart | SlideEnd | SlideFlickEnd

export type Note = MainNote | SlideAmong

export type GameMap = {
    notes: Note[]
    bars: SlideBar[]
    simlines: SimLine[]
    combo: number
}

export function fromRawMap(map: RawMap.RawMap): GameMap {
    map.notes = map.notes.sort((a, b) => {
        const dt = a.time - b.time
        if (dt) return dt
        return a.lane - b.lane
    })
    const slideset = new Map<number, Slide>()
    const slidenotes = new Map<number, RawMap.NoteType[]>()
    for (const s of map.slides) {
        slideset.set(s.id, {
            type: "slide",
            flickend: s.flickend,
            notes: [],
        })
    }
    for (const n of map.notes) {
        if (n.type === "slide") {
            const list = slidenotes.get(n.slideid)
            if (!list) slidenotes.set(n.slideid, [n])
            else list.push(n)
        }
    }
    const notes: Note[] = []
    const simlines: SimLine[] = []
    const bars: SlideBar[] = []
    const timeMap = new Map<number, Note>()
    for (const n of map.notes) {
        if (n.type !== "slide") {
            notes.push({ ...n })
        } else {
            const s = slideset.get(n.slideid)
            if (!s) throw new Error("Can not find slide for note")
            const l = slidenotes.get(n.slideid)
            if (!l) throw new Error("Never happens")
            if (l.length < 2) throw new Error("Slide can not have less than 2 notes")
            if (n === l[0]) {
                notes.push({ type: "slidestart", parent: s, time: n.time, lane: n.lane })
                const start = findex(notes, -1) as SlideStart
                s.notes.push(start)
            } else {
                if (n === l[l.length - 1]) {
                    if (s.flickend) notes.push({ type: "flickend", parent: s, time: n.time, lane: n.lane })
                    else notes.push({ type: "slideend", parent: s, time: n.time, lane: n.lane })
                } else notes.push({ type: "slideamong", parent: s, time: n.time, lane: n.lane })
                const start = findex(s.notes, -1) as SlideStart
                const end = findex(notes, -1) as SlideAmong
                s.notes.push(end)
                bars.push({ type: "slidebar", start, end })
            }
        }
        const right = findex(notes, -1)!
        if (right.type !== "slideamong") {
            const left = timeMap.get(n.time)
            if (left) {
                simlines.push({ type: "simline", left, right })
            }
            timeMap.set(n.time, right)
        }
    }

    return { notes, bars, simlines, combo: notes.length }
}
