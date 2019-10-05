import { FixRatioContainer } from "../Common/FixRatioContainer";
import { injectable } from "inversify";
import { GameConfig } from "../Core/GameConfig";
import { Resources, GlobalEvents } from "../Utils/SymbolClasses";
import { Sprite } from "pixi.js";

@injectable()
export class BackgroundLayer extends FixRatioContainer {
    constructor(config: GameConfig, resources: Resources, events: GlobalEvents) {
        super(0, 0)

        const bg = new Sprite(resources.background.texture)
        bg.alpha = 1 - config.backgroundDim
        this.setInit(bg.width, bg.height)
        {
            const [w, h] = events.Resize.prevArgs
            this.resize(w, h, true)
        }

        events.Resize.add((w, h) => {
            if (!this.parent) return "remove"
            this.resize(w, h, true)
        })

        this.addChild(bg)
    }
}

