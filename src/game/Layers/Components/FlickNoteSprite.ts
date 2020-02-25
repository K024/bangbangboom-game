import { Sprite } from "pixi.js"
import { Resources, NoteHelper } from "../../Utils/SymbolClasses"
import { Flick, SlideFlickEnd } from "../../Core/GameMap"
import { injectable } from "inversify"

@injectable()
export class FlickNoteSprite extends Sprite {
    constructor(private resource: Resources, private helper: NoteHelper) {
        super()
        this.anchor.set(0.5)
        this.visible = false

        this.top = new Sprite(resource.game.textures!.flick_top)
        this.top.anchor.set(0.5, 1)

        this.addChild(this.top)
    }

    private top: Sprite

    setTexture(lane: number) {
        this.texture = this.resource.game.textures!["flick_" + lane]
    }

    note?: Flick | SlideFlickEnd
    shouldRemove = false

    applyInfo(note: Flick | SlideFlickEnd) {
        this.note = note
        this.setTexture(note.lane)
        this.shouldRemove = false
        this.visible = true
    }

    update(musicTime: number) {
        if (this.visible === false || this.shouldRemove || !this.note) return

        if (this.note.judge || musicTime > this.note.time + 1) {
            this.shouldRemove = true
            this.visible = false
            this.zIndex = 0
            return
        }

        const p = this.helper.calc(this.note, musicTime)
        this.position.set(p.x, p.y)
        this.helper.setScale(this, p.scale)

        this.top.y = Math.sin(musicTime * 10) * 30 - 30
        this.zIndex = p.scale
    }
}

