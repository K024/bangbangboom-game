import { Sprite2d } from "../../Common/Sprite2d"
import { injectable } from "inversify"
import { Resources, NoteHelper } from "../../Utils/SymbolClasses"
import { SlideBar } from "../../Core/GameMap"
import { ratio } from "../../../core/Utils"
import { LaneCenterXs } from "../../Core/Constants"
import { projection } from "../../Core/Projection"
import { Matrix } from "pixi.js"

@injectable()
export class SlideBarSprite extends Sprite2d {
    constructor(resources: Resources, private helper: NoteHelper) {
        super(resources.game.textures?.slide_bar)
        this.anchor.set(0.5, 1)
        this.visible = false
    }

    shouldRemove = false
    bar?: SlideBar

    applyInfo(bar: SlideBar) {
        this.bar = bar
        this.visible = true
        this.shouldRemove = false
    }


    update(musicTime: number) {
        if (this.visible === false || this.shouldRemove || !this.bar) return

        let st = this.bar.start.time
        if (st < musicTime && this.bar.start.parent.pointerId) st = musicTime
        let et = this.bar.end.time
        if (et > musicTime + this.helper.staytime) et = musicTime + this.helper.staytime

        if (this.bar.end.judge || this.bar.start.judge === "miss" || st >= et || musicTime > this.bar.end.time + 1
            || (!this.bar.start.parent.pointerId && musicTime > this.bar.start.time + 1)) {
            this.shouldRemove = true
            this.visible = false
            this.zIndex = 0
            return
        }

        const startPos = ratio(this.bar.start.time, this.bar.end.time, st,
            LaneCenterXs[this.bar.start.lane], LaneCenterXs[this.bar.end.lane])
        const startT = (musicTime - st) / this.helper.staytime
        const sp = projection(startT, startPos)

        const endPos = ratio(this.bar.start.time, this.bar.end.time, et,
            LaneCenterXs[this.bar.start.lane], LaneCenterXs[this.bar.end.lane])
        const endT = (musicTime - et) / this.helper.staytime
        const ep = projection(endT, endPos)

        const f = sp.scale / ep.scale

        const sx = this.helper.noteScale * sp.scale / NoteHelper.noteInitScale
        const sy = (sp.y - ep.y) / this.texture.height * f
        this.transform.setFromMatrix(new Matrix(sx, 0,
            (ep.x - sp.x) / (ep.y - sp.y) * sy, sy, sp.x, sp.y))

        this.projectionY = 1 - f

        this.zIndex = sp.scale
    }
}

