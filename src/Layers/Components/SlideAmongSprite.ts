import { Sprite } from "pixi.js"
import { Resources, NoteHelper } from "../../Utils/SymbolClasses"
import { SlideAmong } from "../../Core/GameMap"
import { injectable } from "inversify"

@injectable()
export class SlideAmongSprite extends Sprite {
    constructor(resource: Resources, private helper: NoteHelper) {
        super(resource.game.textures?.slide_among)
        this.anchor.set(0.5)
        this.visible = false
    }

    note?: SlideAmong
    shouldRemove = false

    applyInfo(note: SlideAmong) {
        this.note = note
        this.shouldRemove = false
        this.visible = true
    }

    update(musicTime: number) {
        if (!this.visible || this.shouldRemove || !this.note) return

        if (this.note.judge || musicTime > this.note.time + 1) {
            this.shouldRemove = true
            this.visible = false
            this.zIndex = 0
            return
        }

        const p = this.helper.calc(this.note, musicTime)
        this.position.set(p.x, p.y)
        this.helper.setScale(this, p.scale)

        this.zIndex = p.scale
    }
}
