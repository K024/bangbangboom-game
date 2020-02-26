import { Container, ITextureDictionary } from "pixi.js"
import { injectable } from "inversify"
import { EffectInfo } from "../../Common/InfoType"
import { Resources, GlobalEvents } from "../../Utils/SymbolClasses"
import { InfoEffect } from "../../Common/InfoEffect"
import { GameState } from "../../Core/GameState"
import { Slide } from "../../Core/GameMap"
import { ratio, findex } from "../../../core/Utils"
import { LaneCenterXs, LaneBottomY, LayerWidth, LayerHeight } from "../../Core/Constants"
import { GameConfig } from "../../Core/GameConfig"

type EffectLayerInfo = {
    tap: EffectInfo
    single: EffectInfo
    flick: EffectInfo
    slide: EffectInfo
    fullcombo: EffectInfo
}

export class SingleEffectLayer extends Container {

    constructor(private info: EffectInfo, private textures: ITextureDictionary | undefined, private initScale: number) {
        super()
    }

    update(dt: number) {
        for (let i = 0; i < this.children.length; i++) {
            const x = this.children[i]
            if (x instanceof InfoEffect) {
                x.update(dt)
                if (x.visible && x.allAnimEnd()) {
                    x.visible = false
                    this.freeIndexes.push(i)
                }
            }
        }
    }

    private freeIndexes: number[] = []

    setEffect(x: number, y: number) {
        let i = this.freeIndexes.pop()
        if (i === undefined) {
            i = this.children.length
            const eff = new InfoEffect(this.info, this.textures)
            eff.scale.set(this.initScale)
            this.addChild(eff)
        }
        const e = this.children[i] as InfoEffect
        e.setPosition(x, y)
        e.resetAnim()
        e.visible = true
    }

    setTrackedEffect(tracker: () => { x: number, y: number, visible: boolean }) {
        let i = this.freeIndexes.pop()
        if (i === undefined) {
            i = this.children.length
            const eff = new InfoEffect(this.info, this.textures)
            eff.scale.set(this.initScale)
            this.addChild(eff)
        }
        const e = this.children[i] as InfoEffect

        const pupdate = e.update
        e.update = dt => {
            if (!e.visible) return
            const t = tracker()
            if (!t.visible) {
                e.update = pupdate
                e.stopEmit()
                return
            }
            e.setPosition(t.x, t.y)
            pupdate.call(e, dt)
        }
        const tr = tracker()

        e.setPosition(tr.x, tr.y)
        e.resetAnim()
        e.visible = true
    }
}

function GetSlidePos(note: Slide, musicTime: number) {
    const i = note.nextJudgeIndex || 1
    const n1 = note.notes[i - 1]
    const n2 = note.notes[i]
    return ratio(n1.time, n2.time, musicTime,
        LaneCenterXs[n1.lane], LaneCenterXs[n2.lane])
}


@injectable()
export class EffectLayer extends Container {


    constructor(resources: Resources, state: GameState, events: GlobalEvents, config: GameConfig) {
        super()
        const info = resources.effect.data.info as EffectLayerInfo
        const textures = resources.effect.textures

        const tap = new SingleEffectLayer(info.tap, textures, config.noteScale)
        const single = new SingleEffectLayer(info.single, textures, config.noteScale)
        const flick = new SingleEffectLayer(info.flick, textures, config.noteScale)
        const slide = new SingleEffectLayer(info.slide, textures, config.noteScale)
        const fullcombo = new SingleEffectLayer(info.fullcombo, textures, config.noteScale)

        const slides = new Set<Slide>()

        state.onJudge.add((remove, n) => {
            if (n.judge === "miss") {
                if ("parent" in n) {
                    slides.delete(n.parent)
                }
                return
            }
            if (n.type === "flick" || n.type === "flickend") {
                flick.setEffect(LaneCenterXs[n.lane], LaneBottomY)
            } else {
                single.setEffect(LaneCenterXs[n.lane], LaneBottomY)
            }
            if (n.type !== "single" && n.type !== "flick") {
                if (slides.has(n.parent)) {
                    if (n.type === "slideend" || n.type === "flickend")
                        slides.delete(n.parent)
                } else {
                    slides.add(n.parent)
                    slide.setTrackedEffect(() => {
                        const p = n.parent
                        const mt = state.onMusicTimeUpdate.prevArgs[0].visualTime
                        const visible = p.nextJudgeIndex! < p.notes.length
                            && slides.has(p) && findex(p.notes, -1).time >= mt
                        return {
                            x: visible && GetSlidePos(p, mt) || 0,
                            y: LaneBottomY,
                            visible
                        }
                    })
                }

            }
        })

        state.onEmptyTap.add((remove, l) => {
            if (0 <= l && l <= 6)
                tap.setEffect(LaneCenterXs[l], LaneBottomY)
        })

        state.onFullCombo.add(() => {
            fullcombo.setEffect(LayerWidth / 2, LayerHeight / 2)
        })

        events.Update.add((remove, dt) => {
            if (!this.parent) return remove()
            if (state.paused) return
            for (const x of this.children) {
                if (x instanceof SingleEffectLayer) {
                    x.update(dt)
                }
            }
        })

        this.addChild(tap, single, flick, slide, fullcombo)
    }
}
