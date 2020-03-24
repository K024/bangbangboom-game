import { Container } from "pixi.js"
import { injectable } from "inversify"
import { Container as IOC } from "inversify"
import { FinishLayer } from "../Layers/FinishLayer"
import { GlobalEvents } from "../Utils/SymbolClasses"
import { ReadyScene } from "./ReadyScene"
import { SceneSwitcher } from "./SceneSwitcher"

@injectable()
export class FinishScene extends Container {
    constructor(ioc: IOC, events: GlobalEvents, swicher: SceneSwitcher) {
        super()

        const layer = ioc.resolve(FinishLayer)

        layer.onBack = () => {
            events.End.emit()
        }
        layer.onRetry = () => {
            const ready = ioc.resolve(ReadyScene)
            swicher.switch(this, ready).outEnd.add((remove) => {
                this.destroy({ children: true })
                return remove()
            })
        }

        this.addChild(layer)
    }
}
