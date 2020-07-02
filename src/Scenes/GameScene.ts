import { Container } from "pixi.js"
import { injectable, Container as IOC } from "inversify"
import { GameLayer } from "../Layers/GameLayer"
import { DebugLayer } from "../Layers/DebugLayer"
import { NoteHelper, MainStage, GlobalEvents } from "../Utils/SymbolClasses"
import { GameState } from "../Core/GameState"
import { GameConfig } from "../Core/GameConfig"
import { AutoJudgeManager } from "../Core/JudgeManager.Auto"
import { JudgeManager } from "../Core/JudgeManager"
import { MusciManager } from "../Core/MusicManager"
import { SoundManager } from "../Core/SoundManager"
import { PauseLayer } from "../Layers/PauseLayer"
import { FinishScene } from "./FinishScene"
import { SceneSwitcher } from "./SceneSwitcher"
import { ReadyScene } from "./ReadyScene"

@injectable()
export class GameScene extends Container {
    constructor(ioc: IOC, config: GameConfig, stage: MainStage, events: GlobalEvents, switcher: SceneSwitcher) {
        super()

        ioc = ioc.createChild()
        ioc.bind(IOC).toConstantValue(ioc)

        ioc.bind(NoteHelper).toConstantValue(ioc.resolve(NoteHelper))
        const state = ioc.resolve(GameState)
        ioc.bind(GameState).toConstantValue(state)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const judger = config.autoplay ? ioc.resolve(AutoJudgeManager) : ioc.resolve(JudgeManager)

        ioc.resolve(MusciManager)
        ioc.resolve(SoundManager)

        this.addChild(ioc.resolve(GameLayer))
        if (config.debug) this.addChild(ioc.resolve(DebugLayer))

        let pauseLayer: Container

        state.on.pause.add(() => {
            pauseLayer = ioc.resolve(PauseLayer)
            this.addChild(pauseLayer)
        })

        state.on.continue.add(() => {
            this.removeChild(pauseLayer)
            pauseLayer.destroy({ children: true })
        })

        state.on.end.add(() => {
            const finish = ioc.resolve(FinishScene)
            switcher.switch(this, finish).outEnd.add(remove => {
                this.destroy({ children: true })
                remove()
            })
        })

        state.on.restart.add(() => {
            const ready = ioc.resolve(ReadyScene)
            switcher.switch(this, ready).outEnd.add(remove => {
                this.destroy({ children: true })
                remove()
            })
        })

        state.on.abort.add(() => {
            events.End.emit()
        })
    }
}
