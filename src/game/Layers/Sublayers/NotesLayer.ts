import { Container } from "pixi.js";
import { injectable, Container as IOC } from "inversify"
import { GameState } from "../../Core/GameState";
import { NoteHelper } from "../../Utils/SymbolClasses";
import { SlideBarSprite } from "../Components/SlideBarSprite";
import { SimLineSprite } from "../Components/SimLineSprite";
import { SingleNoteSprite } from "../Components/SingleNoteSprite";
import { FlickNoteSprite } from "../Components/FlickNoteSprite";
import { SlideNoteSprite } from "../Components/SlideNoteSprite";
import { SlideAmongSprite } from "../Components/SlideAmongSprite";
import { GameConfig } from "../../Core/GameConfig";

@injectable()
class BarLayer extends Container {
    constructor(private state: GameState, private helper: NoteHelper, private ioc: IOC) {
        super()
        this.sortableChildren = true
    }

    private nextBarIndex = 0

    update(musicTime: number, showTime: number) {
        let index = this.nextBarIndex
        const list = this.state.map.bars
        while (index < list.length && list[index].start.time < showTime) {
            let bar = (this.children as SlideBarSprite[]).find(x => x.shouldRemove)
            if (!bar) {
                bar = this.ioc.resolve(SlideBarSprite)
                bar.applyInfo(list[index])
                this.addChild(bar)
            } else {
                bar.applyInfo(list[index])
            }
            index++
        }
        this.nextBarIndex = index
        this.children.forEach(x => (x as SlideBarSprite).update(musicTime))

    }
}

@injectable()
class SimLineLayer extends Container {
    constructor(private config: GameConfig, private state: GameState, private ioc: IOC) {
        super()
        this.sortableChildren = true
    }

    private nextSimIndex = 0

    update(musicTime: number, showTime: number) {
        if (this.config.showSimLine) {
            let index = this.nextSimIndex
            const list = this.state.map.simlines
            while (index < list.length && list[index].left.time < showTime) {
                let sim = (this.children as SimLineSprite[]).find(x => x.shouldRemove)
                if (!sim) {
                    sim = this.ioc.resolve(SimLineSprite)
                    sim.applyInfo(list[index])
                    this.addChild(sim)
                } else {
                    sim.applyInfo(list[index])
                }
                index++
            }
            this.nextSimIndex = index
            this.children.forEach(x => (x as SimLineSprite).update(musicTime))
        }
    }
}

const spritemap = {
    single: SingleNoteSprite,
    flick: FlickNoteSprite,
    flickend: FlickNoteSprite,
    slidestart: SlideNoteSprite,
    slideend: SlideNoteSprite,
    slideamong: SlideAmongSprite,
}

@injectable()
class NoteLayer extends Container {
    constructor(private state: GameState, private ioc: IOC) {
        super()
        this.sortableChildren = true
    }

    private nextNoteIndex = 0
    update(musicTime: number, showTime: number) {
        let index = this.nextNoteIndex
        const list = this.state.map.notes
        while (index < list.length && list[index].time < showTime) {
            const n = list[index]
            const spriteType = spritemap[n.type]
            let note = (this.children as noteSprite[]).find(x =>
                x.shouldRemove && x instanceof spriteType)
            if (!note) {
                note = this.ioc.resolve(spriteType as any)
                note.applyInfo(n as any)
                this.addChild(note)
            } else {
                note.applyInfo(n as any)
            }
            index++
        }
        this.nextNoteIndex = index
        this.children.forEach(x => (x as noteSprite).update(musicTime))
    }
}

type noteSprite = SingleNoteSprite | FlickNoteSprite | SlideNoteSprite | SlideAmongSprite

@injectable()
export class NotesLayer extends Container {
    constructor(private state: GameState, ioc: IOC, private helper: NoteHelper, private config: GameConfig) {
        super()

        state.onMusicTimeUpdate.add(this.update)

        this.barLayer = ioc.resolve(BarLayer)
        this.noteLayer = ioc.resolve(NoteLayer)
        this.simLineLayer = ioc.resolve(SimLineLayer)
        this.addChild(this.barLayer)
        this.addChild(this.simLineLayer)
        this.addChild(this.noteLayer)

        this.barLayer.alpha = config.barOpacity
    }

    private barLayer: BarLayer
    private simLineLayer: SimLineLayer
    private noteLayer: NoteLayer

    update = (musicTime: { musicTime: number, visualTime: number, judgeTime: number, }) => {
        if (this.state.ended) return "remove"

        const time = this.helper.staytime + musicTime.visualTime

        this.barLayer.update(musicTime.visualTime, time)
        this.simLineLayer.update(musicTime.visualTime, time)
        this.noteLayer.update(musicTime.visualTime, time)
    }
}


