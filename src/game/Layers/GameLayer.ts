import { FixRatioContainer } from "../Common/FixRatioContainer"
import { LayerWidth, LayerHeight } from "../Core/Constants"
import { injectable } from "inversify"
import { Container as IOC } from "inversify"
import { GlobalEvents } from "../Utils/SymbolClasses"
import { LaneLayer } from "./Sublayers/LaneLayer"
import { IntereactionLayer } from "./Sublayers/IntereactionLayer"
import { NotesLayer } from "./Sublayers/NotesLayer"
import { UILayer } from "./Sublayers/UILayer"
import { EffectLayer } from "./Sublayers/EffectLayer"
import { LaneEffectLayer } from "./Sublayers/LaneEffectLayer"
import { GameConfig } from "../Core/GameConfig"
import { AutoPlayLayer } from "./Sublayers/AutoPlayLayer"

@injectable()
export class GameLayer extends FixRatioContainer {
    constructor(ioc: IOC, events: GlobalEvents, config: GameConfig) {
        super(LayerWidth, LayerHeight)

        this.resize(...events.Resize.prevArgs)
        events.Resize.add((remove, w, h) => {
            if (!this.parent) return remove()
            this.resize(w, h)
        })

        this.addChild(ioc.resolve(LaneLayer))
        this.addChild(ioc.resolve(LaneEffectLayer))
        this.addChild(ioc.resolve(NotesLayer))
        this.addChild(ioc.resolve(EffectLayer))
        this.addChild(ioc.resolve(UILayer))
        this.addChild(ioc.resolve(IntereactionLayer))

        if (config.autoplay) {
            this.addChild(ioc.resolve(AutoPlayLayer))
        }
    }
}

