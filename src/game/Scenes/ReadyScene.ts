import { Container } from "pixi.js"
import { injectable, Container as IOC } from "inversify"
import { ReadyLayer } from "../Layers/ReadyLayer"
import { GameScene } from "./GameScene"
import { GlobalEvents } from "../Utils/SymbolClasses"
import { GameConfig } from "../Core/GameConfig"
import { SceneSwitcher } from "../Utils/SceneSwitcher"


@injectable()
export class ReadyScene extends Container {
    constructor(ioc: IOC, swicher: SceneSwitcher, events: GlobalEvents, config: GameConfig) {
        super()

        const layer = ioc.resolve(ReadyLayer)
        layer.start = (auto?: boolean) => {
            if (auto) config.autoplay = true
            else config.autoplay = false

            const game = ioc.resolve(GameScene)
            swicher.switch(this, game).outEnd.add(() => {
                this.destroy({ children: true })
                return "remove"
            })
        }

        this.addChild(layer)
    }
}


