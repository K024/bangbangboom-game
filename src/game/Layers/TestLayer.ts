import { FixRatioContainer } from "../Common/FixRatioContainer";
import { LayerWidth, LayerHeight } from "../Core/Constants";
import { injectable } from "inversify";
import { GlobalEvents, Resources } from "../Utils/SymbolClasses";
import { Graphics, Texture } from "pixi.js";
import { Sprite2d } from "../Common/Sprite2d";
import { NumberSprite } from "../Common/NumberSprite";

@injectable()
export class TestLayer extends FixRatioContainer {
    constructor(
        resources: Resources,
        events: GlobalEvents
    ) {
        super(LayerWidth, LayerHeight)

        this.resize(...events.Resize.prevArgs)
        events.Resize.add(this.resize.bind(this))

        const numtex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => x.toString()).map(x => resources.ui.textures[x])
        const number = new NumberSprite(numtex)
        number.fontSize = 100

        number.anchor.set(0.5, 0.5)
        number.position.set(300, 300)
        number.setValue(120)
        this.addChild(number)

        const g = new Graphics()
            .beginFill(0xff8800, 0.4)
            .drawRect(300, 300, 100, 100)
            .endFill()
        this.addChild(g)
    }
}

