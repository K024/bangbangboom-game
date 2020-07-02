import { Sprite } from "pixi.js"
import { injectable } from "inversify"
import { Resources, NoteHelper } from "../../Utils/SymbolClasses"
import { SimLine } from "../../Core/GameMap"

@injectable()
export class SimLineSprite extends Sprite {
    constructor(resources: Resources, private helper: NoteHelper) {
        super(resources.game.textures?.simultaneous_line)
        this.anchor.set(0.5)
        this.visible = false
    }

    sim?: SimLine
    shouldRemove = false

    applyInfo(sim: SimLine) {
        this.sim = sim
        this.shouldRemove = false
        this.visible = true
    }

    update(musicTime: number) {
        if (!this.visible || this.shouldRemove || !this.sim) return

        if (this.sim.left.judge || this.sim.right.judge || musicTime > this.sim.left.time + 1) {
            this.shouldRemove = true
            this.visible = false
            this.zIndex = 0
            return
        }

        const lp = this.helper.calc(this.sim.left, musicTime)
        const rp = this.helper.calc(this.sim.right, musicTime)
        this.height = lp.scale * this.texture.height * this.helper.noteScale
        this.width = lp.x - rp.x

        this.x = (lp.x + rp.x) / 2
        this.y = lp.y

        this.zIndex = lp.scale
    }
}
