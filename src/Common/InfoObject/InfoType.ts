import { ParticleOption } from "../ParticleEmitter"
import { Animation } from "../Animation/Animation"
import { Sprite } from "pixi.js"

export type PositionInfo = {
    x?: number
    y?: number
    width?: number
    height?: number
    anchor?: { x: number; y: number } | number
    rotation?: number
    scale?: { x: number; y: number } | number
}

export type SpriteInfo = {
    texture?: string
    position?: PositionInfo
    animations?: {
        [propName: string]: Animation
    }
    children?: SpriteInfo[]
    blend?: "normal" | "add"
    tint?: string
}

export type EffectInfo = {
    particles?: Array<{
        textures: string[]
        option: ParticleOption
        delay?: number
    }>
    sprites?: SpriteInfo[]
}

export type NumberSpriteInfo = {
    fontTint?: string
    fontSize?: number
    fontPadding?: number
    position: PositionInfo
    animations?: {
        [propName: string]: Animation
    }
    children?: SpriteInfo[]
}

export function setPositionInfo(s: Sprite, pos: PositionInfo) {
    if (!pos) return
    if (pos.x !== undefined) s.x = pos.x
    if (pos.y !== undefined) s.y = pos.y
    if (pos.width !== undefined) s.width = pos.width
    if (pos.height !== undefined) s.height = pos.height
    if (pos.anchor !== undefined) {
        if (typeof pos.anchor === "number") s.anchor.set(pos.anchor)
        else s.anchor.set(pos.anchor.x, pos.anchor.y)
    }
    if (pos.rotation !== undefined) s.rotation = pos.rotation
    if (pos.scale !== undefined) {
        if (typeof pos.scale === "number") s.scale.set(pos.scale)
        else s.scale.set(pos.scale.x, pos.scale.y)
    }
}
