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

@injectable()
class BarLayer extends Container {
    constructor(private state: GameState, private helper: NoteHelper, private ioc: IOC) {
        super()
        this.sortableChildren = true
    }

    private nextBarIndex = 0

    private pool: SlideBarSprite[] = []
    private freeIndexes: number[] = []

    update(musicTime: number, showTime: number) {
        let index = this.nextBarIndex
        const list = this.state.map.bars
        while (index < list.length && list[index].start.time < showTime) {
            let i = this.freeIndexes.pop()
            if (i === undefined) {
                i = this.pool.length
                const b = this.ioc.resolve(SlideBarSprite)
                this.addChild(b)
                this.pool.push(b)
            }
            const bar = this.pool[i]
            bar.applyInfo(list[index])
            index++
        }
        this.nextBarIndex = index
        for (let i = 0; i < this.pool.length; i++) {
            const x = this.pool[i]
            x.update(musicTime)
            if (x.shouldRemove) {
                x.shouldRemove = false
                this.freeIndexes.push(i)
            }
        }

    }
}

@injectable()
class SimLineLayer extends Container {
    constructor(private config: GameConfig, private state: GameState, private ioc: IOC) {
        super()
        this.sortableChildren = true
    }

    private nextSimIndex = 0

    private pool: SimLineSprite[] = []
    private freeIndexes: number[] = []

    update(musicTime: number, showTime: number) {
        if (this.config.showSimLine) {
            let index = this.nextSimIndex
            const list = this.state.map.simlines
            while (index < list.length && list[index].left.time < showTime) {
                let i = this.freeIndexes.pop()
                if (i === undefined) {
                    i = this.pool.length
                    const s = this.ioc.resolve(SimLineSprite)
                    this.addChild(s)
                    this.pool.push(s)
                }
                const sim = this.pool[i]
                sim.applyInfo(list[index])
                index++
            }
            this.nextSimIndex = index
            for (let i = 0; i < this.pool.length; i++) {
                const x = this.pool[i]
                x.update(musicTime)
                if (x.shouldRemove) {
                    x.shouldRemove = false
                    this.freeIndexes.push(i)
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
        this.freeIndexes = {}
        for (const key in spritemap)
            this.freeIndexes[key] = []
    }

    private nextNoteIndex = 0

    private pool: noteSprite[] = []
    private freeIndexes: { [key: string]: number[] }

    update(musicTime: number, showTime: number) {
        let index = this.nextNoteIndex
        const list = this.state.map.notes
        while (index < list.length && list[index].time < showTime) {
            const info = list[index]
            let i = this.freeIndexes[info.type].pop()
            if (i === undefined) {
                i = this.pool.length
                const n = this.ioc.resolve(spritemap[info.type] as any) as any
                this.addChild(n)
                this.pool.push(n)
            }
            const note = this.pool[i]
            note.applyInfo(info as any)
            index++
        }
        this.nextNoteIndex = index
        for (let i = 0; i < this.pool.length; i++) {
            const x = this.pool[i]
            x.update(musicTime)
            if (x.shouldRemove) {
                x.shouldRemove = false
                this.freeIndexes[x.note!.type].push(i)
            }
        }
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

    update = (remove: () => void, musicTime: { musicTime: number, visualTime: number, judgeTime: number, }) => {
        if (this.state.ended) return remove()

        const time = this.helper.staytime + musicTime.visualTime

        this.barLayer.update(musicTime.visualTime, time)
        this.simLineLayer.update(musicTime.visualTime, time)
        this.noteLayer.update(musicTime.visualTime, time)
    }
}


