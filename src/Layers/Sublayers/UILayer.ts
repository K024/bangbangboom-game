import { Container } from "pixi.js"
import { injectable } from "inversify"
import { GameState } from "../../Core/GameState"
import { GameConfig } from "../../Core/GameConfig"
import { SpriteInfo, NumberSpriteInfo } from "../../Common/InfoObject/InfoType"
import { InfoSprite } from "../../Common/InfoObject/InfoSprite"
import { Resources, GlobalEvents } from "../../Utils/SymbolClasses"
import { InfoNumberSprite } from "../../Common/InfoObject/InfoNumberSprite"

type UILayerInfo = {
    judge: SpriteInfo
    pause: SpriteInfo
    combo: NumberSpriteInfo
    score: NumberSpriteInfo
    other?: SpriteInfo[]
}

@injectable()
export class UILayer extends Container {
    constructor(state: GameState, config: GameConfig, resources: Resources, events: GlobalEvents) {
        super()

        const info = resources.ui.data.info.game as UILayerInfo
        const textures = resources.ui.textures

        if (info.other instanceof Array) {
            for (const x of info.other) {
                this.addChild(new InfoSprite(x, textures))
            }
        }

        const judge = new InfoSprite(info.judge, textures)
        const pause = new InfoSprite(info.pause, textures)

        const combo = new InfoNumberSprite(info.combo, textures!)
        const score = new InfoNumberSprite(info.score, textures!)

        // if (!config.autoplay)
        this.addChild(judge)
        this.addChild(pause)
        this.addChild(combo)
        this.addChild(score)

        pause.interactive = true
        //        pause.buttonMode = true
        pause.on("pointertap", () => {
            if (!state.paused) state.on.pause.emit()
        })

        score.setValue(0)
        combo.visible = false

        state.on.judge.add((remove, note) => {
            if (!this.parent) return remove()
            judge.texture = textures![note.judge!]
            judge.resetAnim()
            if (state.currentCombo > 0) {
                combo.setValue(state.currentCombo)
                combo.resetAnim()
                combo.visible = true
            } else {
                combo.visible = false
            }
            score.setValue(state.score)
            score.resetAnim()
        })

        events.Update.add((remove, dt) => {
            if (!this.parent) return remove()
            if (state.paused) return
            for (const x of this.children) {
                if (x instanceof InfoSprite || x instanceof InfoNumberSprite) {
                    x.update(dt)
                }
            }
        })
    }
}
