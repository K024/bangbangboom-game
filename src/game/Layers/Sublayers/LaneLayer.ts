import { Container, Sprite } from "pixi.js"
import { injectable } from "inversify"
import { Resources } from "../../Utils/SymbolClasses"
import { CenterX, LaneBottomY } from "../../Core/Constants"

@injectable()
export class LaneLayer extends Container {
    constructor(resources: Resources) {
        super()

        const lane = new Sprite(resources.game.textures!.rhythm_line)
        lane.anchor.set(0.5, 1)
        lane.position.set(CenterX, LaneBottomY)
        this.addChild(lane)

        const line = new Sprite(resources.game.textures!.play_line)
        line.anchor.set(0.5)
        line.position.set(CenterX, LaneBottomY)
        this.addChild(line)

        // this.cacheAsBitmap = true
    }
}
