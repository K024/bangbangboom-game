import { Container, Text, BLEND_MODES } from "pixi.js"
import { LayerWidth, LayerHeight } from "../../Core/Constants"
import { injectable } from "inversify"

@injectable()
export class AutoPlayLayer extends Container {
    constructor() {
        super()

        const auto = new Text("AUTOPLAY", {
            fontSize: 52,
            fill: [0xffffff, 0x888888]
        })

        auto.blendMode = BLEND_MODES.ADD
        auto.alpha = 0.3
        auto.anchor.x = 0.5
        auto.position.set(LayerWidth / 2, LayerHeight / 2)
        this.addChild(auto)
    }
}
