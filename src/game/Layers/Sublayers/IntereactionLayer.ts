import { Container, Graphics, interaction } from "pixi.js"
import { LayerHeight, CenterX, LaneWidth } from "../../Core/Constants"
import { GameConfig } from "../../Core/GameConfig"
import { injectable } from "inversify"
import { GameState } from "../../Core/GameState"

@injectable()
export class IntereactionLayer extends Container {
    constructor(
        config: GameConfig,
        state: GameState
    ) {
        super()

        const hw = 4.5 * LaneWidth
        const h = LayerHeight * 1.2

        const rect = new Graphics()
        rect.position.set(CenterX, LayerHeight * 0.3)
        rect.lineStyle(3, 0xff0088)
        rect.moveTo(-hw, 0).lineTo(hw, 0).lineTo(hw, h).lineTo(-hw, h).lineTo(-hw, 0)

        this.addChild(rect)

        rect.alpha = config.debug ? 1 : 0
        rect.interactive = true
        //        rect.buttonMode = true
        rect.hitArea = rect.getLocalBounds()

        const getlane = (x: number, y: number) => {
            if (y < 0) return -1
            const pm = x >= 0 ? 1 : -1
            let dl = (Math.abs(x) + LaneWidth / 2) / LaneWidth
            if (dl >= 5) return -1
            if (dl >= 4) dl = 3.5
            return 3 + Math.floor(dl) * pm
        }

        const typemap: any = {
            pointerup: "up",
            pointerdown: "down",
            pointerupoutside: "up",
            pointermove: "move"
        }


        const listen = (...events: string[]) => {
            events.forEach(name => rect.on(name, (e: interaction.InteractionEvent) => {
                e.stopPropagation()

                const type = typemap[name]
                const p = rect.toLocal(e.data.global)
                const pointerId = e.data.pointerId || 0xffffff

                const ev = {
                    pointerId,
                    time: 0,
                    lane: getlane(p.x, p.y),
                    type,
                    x: p.x,
                    y: p.y
                }
                state.on.pointer.emit(ev)

                if (config.debug && name.indexOf("move") < 0) console.log(name, ev)
            }))
        }

        listen("pointerup", "pointerdown", "pointerupoutside", "pointermove")
    }
}


