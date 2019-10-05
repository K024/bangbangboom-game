import { Container } from "pixi.js";
import { injectable, Container as IOC } from "inversify";
import { GameLayer } from "../Layers/GameLayer";
import { DebugLayer } from "../Layers/DebugLayer";
import { NoteHelper, MainStage, GlobalEvents } from "../Utils/SymbolClasses";
import { GameState } from "../Core/GameState";
import { GameConfig } from "../Core/GameConfig";
import { AutoJudgeManager } from "../Core/JudgeManager.Auto";
import { JudgeManager } from "../Core/JudgeManager";
import { MusciManager } from "../Core/MusicManager";
import { SoundManager } from "../Core/SoundManager";
import { PauseLayer } from "../Layers/PauseLayer";
import { FinishScene } from "./FinishScene";
import { SceneSwitcher } from "../Utils/SceneSwitcher";
import { ReadyScene } from "./ReadyScene";

@injectable()
export class GameScene extends Container {
    constructor(ioc: IOC, config: GameConfig, stage: MainStage, events: GlobalEvents, switcher: SceneSwitcher) {
        super()

        if (ioc.isBound(NoteHelper)) ioc.unbind(NoteHelper)
        ioc.bind(NoteHelper).toConstantValue(ioc.resolve(NoteHelper))
        if (ioc.isBound(GameState)) ioc.unbind(GameState)
        const state = ioc.resolve(GameState)
        ioc.bind(GameState).toConstantValue(state)

        const judger = config.autoplay ? ioc.resolve(AutoJudgeManager)
            : ioc.resolve(JudgeManager)

        ioc.resolve(MusciManager)
        ioc.resolve(SoundManager)

        this.addChild(ioc.resolve(GameLayer))
        if (config.debug)
            this.addChild(ioc.resolve(DebugLayer))

        const pauseLayer = ioc.resolve(PauseLayer)

        state.onPause.add(() => {
            this.addChild(pauseLayer)
        })

        state.onContinue.add(() => {
            this.removeChild(pauseLayer)
        })

        state.onEnd.add(() => {
            const finish = ioc.resolve(FinishScene)
            switcher.switch(this, finish).outEnd.add(() => {
                this.destroy({ children: true })
                return "remove"
            })
        })

        state.onRestart.add(() => {
            const ready = ioc.resolve(ReadyScene)
            switcher.switch(this, ready).outEnd.add(() => {
                this.destroy({ children: true })
                return "remove"
            })
        })

        state.onAbort.add(() => {
            events.End.emit()
        })
    }
}
