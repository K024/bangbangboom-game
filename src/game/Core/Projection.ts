import { CenterX, FarLineZ, LaneInfY, LaneBottomY } from "./Constants"
import { ratio } from "../../core/Utils"

/**
 * fall function
 * @param t 0: near, -1: far
 * @returns 0 -> 1, ratio of y
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fall(t: number) {
    return Math.pow(1.1, 50 * t)
}

const falllist: number[] = []
for (let i = 0; i < 100; i++) {
    falllist.push(Math.pow(1.1, i - 50))
}

function fastfall(t: number) {
    const tt = (t + 1) * 50
    let i = Math.floor(tt)
    if (i > 98) i = 98
    else if (i < 0) i = 0
    return ratio(i, i + 1, tt, falllist[i], falllist[i + 1])
}

/**
 * projection
 * @param trackpos 0: near, -1: far
 * @param laneOffset Lane center x or other
 */
export function projection(trackpos: number, laneOffset: number) {
    // const f = fall(trackpos);
    const f = fastfall(trackpos)
    const r = ((FarLineZ - 1) * f + 1) / FarLineZ
    return {
        x: CenterX + (laneOffset - CenterX) * r,
        y: LaneInfY + (LaneBottomY - LaneInfY) * r,
        scale: r,
    }
}
