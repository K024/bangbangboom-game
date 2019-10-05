
import * as Core from '../../core/MapCore'
import { findex } from '../../core/Utils'
import { Judge } from './Constants'


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

export function FromMapCore(map: Core.GameMap): GameMap {
    const notes: Note[] = []
    const bars: SlideBar[] = []
    let combo = 0
    for (const tp of map.timepoints) {
        const dt = 60 / tp.bpm / 24
        const off = tp.offset
        const realtime = (time: number) => off + dt * time
        for (const n of tp.notes) {
            switch (n.type) {
                case "single":
                    notes.push({ type: "single", time: realtime(n.time), lane: n.lane, onbeat: n.time % 24 === 0 })
                    combo++
                    break
                case "flick":
                    notes.push({ type: "flick", time: realtime(n.time), lane: n.lane })
                    combo++
                    break
                case "slide":
                    const slide: Slide = {
                        type: "slide", flickend: n.flickend,
                        notes: []
                    }
                    notes.push({
                        type: "slidestart", parent: slide,
                        time: realtime(n.notes[0].time), lane: n.notes[0].lane,
                    })
                    slide.notes.push(findex(notes, -1) as SlideStart)
                    combo++
                    for (let i = 1; i < n.notes.length - 1; i++) {
                        notes.push({
                            type: "slideamong", parent: slide,
                            time: realtime(n.notes[i].time), lane: n.notes[i].lane
                        })
                        slide.notes.push(findex(notes, -1) as SlideAmong)
                        bars.push({
                            type: "slidebar",
                            start: findex(notes, -2) as SlideStart, end: findex(notes, -1) as SlideAmong
                        })
                        combo++
                    }
                    const end = findex(n.notes, -1)
                    notes.push({
                        type: n.flickend ? "flickend" : "slideend", parent: slide,
                        time: realtime(end.time), lane: end.lane
                    } as SlideFlickEnd)
                    slide.notes.push(findex(notes, -1) as SlideEnd)
                    bars.push({
                        type: "slidebar",
                        start: findex(notes, -2) as SlideAmong, end: findex(notes, -1) as SlideEnd
                    })
                    combo++
                    if (n.notes.length === 2 && n.notes[0].lane === n.notes[1].lane)
                        slide.long = true
            }
        }
    }
    notes.sort((a, b) => {
        const dt = a.time - b.time
        if (dt) return dt
        return a.lane - b.lane
    })
    bars.sort((a, b) => {
        const dt = a.start.time - b.start.time
        if (dt) return dt
        return a.start.lane - b.start.lane
    })

    const timemap = new Map<number, MainNote>()
    const simlines: SimLine[] = []
    for (const n of notes) {
        switch (n.type) {
            case "single": case "flick": case "slidestart": case "slideend": case "flickend":
                const s = timemap.get(n.time)
                if (s) {
                    simlines.push({ type: "simline", left: s, right: n })
                }
                timemap.set(n.time, n)
        }
    }

    simlines.sort((a, b) => {
        return a.left.time - b.left.time
    })

    return { notes, combo, bars, simlines }
}

export function FromString(str: string, mirror = false) {
    const map = FromMapCore(Core.GameMapFromString(str))
    if (mirror) {
        map.notes.forEach(x => x.lane = 6 - x.lane)
    }
    return map
}

