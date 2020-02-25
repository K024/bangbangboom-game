import { FixRatioContainer } from "../Common/FixRatioContainer"
import { LayerWidth, LayerHeight, LaneBottomY, LaneCenterXs, LaneInfY, CenterX, LaneWidth, FarLineY } from "../Core/Constants"
import { injectable } from "inversify"
import { GlobalEvents } from "../Utils/SymbolClasses"
import { Graphics } from "pixi.js"
import { GameConfig } from "../Core/GameConfig"

@injectable()
export class DebugLayer extends FixRatioContainer {
    constructor(
        events: GlobalEvents,
        config: GameConfig
    ) {
        super(LayerWidth, LayerHeight)
        this.visible = !!config.debug
        this.alpha = 0.2

        this.resize(...events.Resize.prevArgs)
        events.Resize.add((remove, w, h) => {
            if (!this.parent) return remove()
            this.resize(w, h)
        })

        const border = new Graphics()
        border.lineStyle(2, 0xff8800)
        border.moveTo(0, 0).lineTo(0, LayerHeight).lineTo(LayerWidth, LayerHeight).lineTo(LayerWidth, 0).lineTo(0, 0)
        this.addChild(border)

        const nearFarLines = new Graphics()
        nearFarLines.lineStyle(4, 0x0088ff)
        nearFarLines.moveTo(0, LaneBottomY).lineTo(LayerWidth, LaneBottomY)
        nearFarLines.lineStyle(2, 0x0088ff)
        nearFarLines.moveTo(0, FarLineY).lineTo(LayerWidth, FarLineY)
        this.addChild(nearFarLines)

        const centerLines = new Graphics()
        centerLines.lineStyle(2, 0x004422)
        LaneCenterXs.forEach(x => {
            centerLines.moveTo(CenterX, LaneInfY).lineTo(x, LaneBottomY)
        })
        this.addChild(centerLines)

        const borderLines = new Graphics()
        borderLines.lineStyle(2, 0x00aa44)
        const borderXs = LaneCenterXs.map(x => x - LaneWidth / 2)
        borderXs.push(borderXs[borderXs.length - 1] + LaneWidth)
        borderXs.forEach(x => {
            borderLines.moveTo(CenterX, LaneInfY).lineTo(x, LaneBottomY)
        })
        this.addChild(borderLines)
    }
}

