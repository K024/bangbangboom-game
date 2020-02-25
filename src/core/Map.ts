

export type NoteBase = {
    /** real time from music starts */
    time: number
    /** left: 0 ---- right : 6 */
    lane: number
}

export type Single = NoteBase & {
    type: "single"
    /** is the note on beat or not */
    onbeat: boolean
}

export type Flick = NoteBase & {
    type: "flick"
}

export type Slide = {
    id: number
    flickend: boolean
}

export type SlideNote = NoteBase & {
    type: "slide"
    slideid: number
}

export type NoteType = Single | Flick | SlideNote

export type RawMap = {
    notes: NoteType[]
    slides: Slide[]
}
