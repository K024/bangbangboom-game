import ajv from "ajv"

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

export const ValidateRawMap = ajv().compile({
    definitions: {
        NoteBase: {
            type: "object",
            properties: {
                time: { type: "number", minimum: 0 },
                lane: { type: "integer", minimum: 0, maximum: 6 },
            },
            required: ["time", "lane"],
        },
        Single: {
            allOf: [
                { $ref: "#/definitions/NoteBase" },
                {
                    type: "object",
                    properties: {
                        type: { enum: ["single"] },
                        onbeat: { type: "boolean" },
                    },
                    required: ["type"],
                },
            ],
        },
        Flick: {
            allOf: [
                { $ref: "#/definitions/NoteBase" },
                {
                    type: "object",
                    properties: {
                        type: { enum: ["flick"] },
                    },
                    required: ["type"],
                },
            ],
        },
        Slide: {
            type: "object",
            properties: {
                id: { type: "number" },
                flickend: { type: "boolean" },
            },
            required: ["id"],
        },
        SlideNote: {
            allOf: [
                { $ref: "#/definitions/NoteBase" },
                {
                    type: "object",
                    properties: {
                        type: { enum: ["slide"] },
                        slideid: { type: "number" },
                    },
                    required: ["type", "slideid"],
                },
            ],
        },
    },

    type: "object",
    properties: {
        notes: {
            type: "array",
            items: {
                anyOf: [
                    { $ref: "#/definitions/Single" },
                    { $ref: "#/definitions/Flick" },
                    { $ref: "#/definitions/SlideNote" },
                ],
            },
        },
        slides: {
            type: "array",
            items: { $ref: "#/definitions/Slide" },
        },
    },
    required: ["notes", "slides"],
})
