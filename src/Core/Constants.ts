export const LayerWidth = 1280
export const LayerHeight = 720

export const CenterX = LayerWidth / 2

export const LaneInfY = -5
export const LaneBottomY = LayerHeight * 0.85

export const LaneWidth = 0.12 * LayerWidth

export const LaneCenterXs: number[] = []

for (let i = -3; i < 4; i++) {
    LaneCenterXs.push(CenterX + i * LaneWidth)
}

export const FarLineZ = 20
export const FarLineY = (LaneBottomY - LaneInfY) / FarLineZ + LaneInfY

export type Judge = "perfect" | "great" | "good" | "bad" | "miss"

export const JudgeOffset = {
    /**
     * single
     * flick (pointer down time)
     * long start
     */
    typeA: (offset: number) => {
        const off = (offset * 1000) | 0
        if (off < -200) return undefined
        if (off < -150 || off > 150) return "miss"
        if (off < -125 || off > 125) return "bad"
        if (off < -100 || off > 100) return "good"
        if (off < -50 || off > 50) return "great"
        return "perfect"
    },
    /**
     * long end
     * long end flick (point move out time)
     */
    typeB: (offset: number) => {
        const off = (offset * 1000) | 0
        if (off < -200) return undefined
        if (off < -170 || off > 170) return "miss"
        if (off < -150 || off > 150) return "bad"
        if (off < -120 || off > 120) return "good"
        if (off < -70 || off > 70) return "great"
        return "perfect"
    },
    /**
     * slide start
     * slide end
     */
    typeC: (offset: number) => {
        const off = (offset * 1000) | 0
        if (off < -200) return undefined
        if (off < -150 || off > 200) return "miss"
        if (off < -125) return "bad"
        if (off < -100) return "good"
        if (off < -50) return "great"
        return "perfect"
    },
    /**
     * slide end flick (pointer move out time)
     */
    typeD: (offset: number) => {
        const off = (offset * 1000) | 0
        if (off < 0) return undefined
        if (off > 120) return "miss"
        return "perfect"
    },
    /**
     * slide among
     */
    typeE: (offset: number) => {
        const off = (offset * 1000) | 0
        if (off < 0) return undefined
        if (off > 200) return "miss"
        return "perfect"
    },
    flickOutTime: 0.1,
    flickOutDis: 40,
}
