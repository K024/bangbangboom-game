import "reflect-metadata"
import { Ticker } from "./Utils/Ticker"
import { GameConfig, GameLoadConfig } from "./Core/GameConfig"
import { Container } from "inversify"
import { GameEvent } from "./Utils/GameEvent"
import { LoadingScene } from "./Scenes/LoadingScene"
import { GlobalEvents, MainStage } from "./Utils/SymbolClasses"
import { addAutoListener } from "./Utils/Utils"
import { SceneSwitcher } from "./Utils/SceneSwitcher"
import { Renderer, autoDetectRenderer, utils } from "pixi.js"

type Optional<T> = {
    [prop in keyof T]?: T[prop]
}

export class Game {
    private readonly renderer: Renderer
    private readonly stage = new MainStage()
    private readonly ticker = new Ticker()
    private readonly ioc = new Container({ skipBaseClassChecks: true })
    private readonly events = new GlobalEvents()

    constructor(canvas: HTMLCanvasElement, config: Optional<GameConfig>, loadConfig: Optional<GameLoadConfig>) {

        this.renderer = autoDetectRenderer({
            view: canvas,
            width: canvas.clientWidth,
            height: canvas.clientHeight,
            resolution: config.resolution,
        })

        this.ioc.bind(Container).toConstantValue(this.ioc)
        this.ioc.bind(MainStage).toConstantValue(this.stage)
        this.ioc.bind(GlobalEvents).toConstantValue(this.events)

        if (config instanceof GameConfig)
            this.ioc.bind(GameConfig).toConstantValue(config)
        else
            this.ioc.bind(GameConfig).toConstantValue(Object.assign(new GameConfig(), config))
        if (loadConfig instanceof GameLoadConfig)
            this.ioc.bind(GameLoadConfig).toConstantValue(loadConfig)
        else
            this.ioc.bind(GameLoadConfig).toConstantValue(Object.assign(new GameLoadConfig(), loadConfig))
        this.ioc.bind(SceneSwitcher).toSelf().inSingletonScope()

        this.ticker.Tick.add((delta, now) => {
            this.resize()
            this.events.Update.emit(delta, now)
            this.renderer.render(this.stage)
        })

        this.resize()
        this.stage.addChild(this.ioc.resolve(LoadingScene))

        addAutoListener(window, "blur", () => {
            if (this._destroyed) return "remove"
            this.events.WindowBlur.emit()
            this.ticker.Stop()
        })

        addAutoListener(window, "focus", () => {
            if (this._destroyed) return "remove"
            this.ticker.Start()
            this.events.WindowFocus.emit()
        })

        this.events.End.add(() => {
            if (this._destroyed) return "remove"
            this.destroy()
        })
    }

    start() {
        this.ticker.Start()
    }

    pause() {
        this.ticker.Stop()
    }

    private _destroyed = false

    ondestroyed: () => void

    destroy() {
        if (this._destroyed) return
        this._destroyed = true
        this.ticker.Stop()
        this.ticker.Tick.clear()
        this.events.End.emit()
        for (const e in this.events) this.events[e as keyof GlobalEvents].clear()
        this.ioc.unbindAll()
        this.stage.destroy()
        this.renderer.clear()
        this.renderer.destroy()
        utils.clearTextureCache()
        if (this.ondestroyed instanceof Function)
            this.ondestroyed()
    }

    private resize() {
        const h = window.innerHeight
        const w = window.innerWidth
        const s = this.renderer.screen
        if (h !== s.height || w !== s.width || !this.events.Resize.prevArgs) {
            this.renderer.resize(w, h)
            this.events.Resize.emit(w, h)
        }
    }
}

