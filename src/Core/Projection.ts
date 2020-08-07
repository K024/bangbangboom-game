import { CenterX, FarLineZ, LaneInfY, LaneBottomY } from "./Constants"

/**
 * fall function
 * @param t 0: near, -1: far
 * @returns 0 -> 1, ratio of y
 */
function fall(t: number) {
    return Math.pow(1.1, 50 * t)
}

/**
 * projection
 * @param trackpos 0: near, -1: far
 * @param laneOffset Lane center x or other
 */
export function projection(trackpos: number, laneOffset: number) {
    const f = fall(trackpos)
    const r = ((FarLineZ - 1) * f + 1) / FarLineZ
    return {
        x: CenterX + (laneOffset - CenterX) * r,
        y: LaneInfY + (LaneBottomY - LaneInfY) * r,
        scale: r,
    }
}
