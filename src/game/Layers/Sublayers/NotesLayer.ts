import { Container } from "pixi.js"
import { injectable, Container as IOC } from "inversify"
import { GameState } from "../../Core/GameState"
import { NoteHelper } from "../../Utils/SymbolClasses"
import { SlideBarSprite } from "../Components/SlideBarSprite"
import { SimLineSprite } from "../Components/SimLineSprite"
import { SingleNoteSprite } from "../Components/SingleNoteSprite"
import { FlickNoteSprite } from "../Components/FlickNoteSprite"
import { SlideNoteSprite } from "../Components/SlideNoteSprite"
import { SlideAmongSprite } from "../Components/SlideAmongSprite"
import { GameConfig } from "../../Core/GameConfig"
import { ObjectPool } from "../../Utils/Utils"

@injectable()
class BarLayer extends Container {
    constructor(private state: GameState, private helper: NoteHelper, private ioc: IOC) {
        super()
        this.sortableChildren = true
        this.pool.newObj = () => {
            const b = this.ioc.resolve(SlideBarSprite)
            this.addChild(b)
            return b
        }
    }

    private nextBarIndex = 0
    
    private pool = new ObjectPool<SlideBarSprite>()

    update(musicTime: number, showTime: number) {
        let index = this.nextBarIndex
        const list = this.state.map.bars
        while (index < list.length && list[index].start.time < showTime) {
            const bar = this.pool.get()
            bar.applyInfo(list[index])
            index++
        }
        this.nextBarIndex = index
        for (let i = 0; i < this.children.length; i++) {
            const x = this.children[i] as SlideBarSprite
            x.update(musicTime)
            if (x.shouldRemove) {
                x.shouldRemove = false
                this.pool.save(x)
            }
        }

    }
}

@injectable()
class SimLineLayer extends Container {
    constructor(private config: GameConfig, private state: GameState, private ioc: IOC) {
        super()
        this.sortableChildren = true
        this.pool.newObj = () => {
            const s = this.ioc.resolve(SimLineSprite)
            this.addChild(s)
            return s
        }
    }

    private nextSimIndex = 0
    
    private pool = new ObjectPool<SimLineSprite>()

    update(musicTime: number, showTime: number) {
        if (this.config.showSimLine) {
            let index = this.nextSimIndex
            const list = this.state.map.simlines
            while (index < list.length && list[index].left.time < showTime) {
                const sim = this.pool.get()
                sim.applyInfo(list[index])
                index++
            }
            this.nextSimIndex = index
            for (let i = 0; i < this.children.length; i++) {
                const x = this.children[i] as SimLineSprite
                x.update(musicTime)
                if (x.shouldRemove) {
                    x.shouldRemove = false
                    this.pool.save(x)
                }
            }
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
        for (const key in spritemap){
            this.pool[key] = new ObjectPool()
            this.pool[key].newObj = () => {
                const type = (spritemap as any)[key]
                const n = this.ioc.resolve(type) as noteSprite
                this.addChild(n)
            }
        }
    }

    private nextNoteIndex = 0

    private pool: { [key: string]: ObjectPool<any> } = {}

    update(musicTime: number, showTime: number) {
        let index = this.nextNoteIndex
        const list = this.state.map.notes
        while (index < list.length && list[index].time < showTime) {
            const info = list[index]
            const note = this.pool[info.type].get() as noteSprite
            note.applyInfo(info as any)
            index++
        }
        this.nextNoteIndex = index
        for (let i = 0; i < this.children.length; i++) {
            const x = this.children[i] as noteSprite
            x.update(musicTime)
            if (x.shouldRemove) {
                x.shouldRemove = false
                this.pool[x.note!.type].save(x)
            }
        }
    }
}

type noteSprite = SingleNoteSprite | FlickNoteSprite | SlideNoteSprite | SlideAmongSprite

@injectable()
export class NotesLayer extends Container {
    constructor(private state: GameState, ioc: IOC, private helper: NoteHelper, private config: GameConfig) {
        super()

        state.on.musicTimeUpdate.add(this.update)

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

    update = (remove: () => void, musicTime: { musicTime: number, visualTime: number, judgeTime: number, }) => {
        if (this.state.ended) return remove()

        const time = this.helper.staytime + musicTime.visualTime

        this.barLayer.update(musicTime.visualTime, time)
        this.simLineLayer.update(musicTime.visualTime, time)
        this.noteLayer.update(musicTime.visualTime, time)
    }
}


