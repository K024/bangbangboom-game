import { Container, Texture, Sprite } from "pixi.js";
import { injectable } from "inversify";
import { GameState } from "../../Core/GameState";
import { GameConfig } from "../../Core/GameConfig";
import { SpriteInfo, NumberSpriteInfo } from "../../Common/InfoType";
import { InfoSprite } from "../../Common/InfoSprite";
import { Resources, GlobalEvents } from "../../Utils/SymbolClasses";
import { InfoNumberSprite } from "../../Common/InfoNumberSprite";


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
            info.other.forEach(x => {
                this.addChild(new InfoSprite(x, textures))
            })
        }

        const judge = new InfoSprite(info.judge, textures)
        const pause = new InfoSprite(info.pause, textures)

        const combo = new InfoNumberSprite(info.combo, textures)
        const score = new InfoNumberSprite(info.score, textures)

        // if (!config.autoplay)
        this.addChild(judge)
        this.addChild(pause)
        this.addChild(combo)
        this.addChild(score)

        pause.interactive = true
        //        pause.buttonMode = true
        pause.on("pointertap", () => {
            state.onPause.emit()
        })

        score.setValue(0)
        combo.visible = false

        state.onJudge.add(note => {
            if (!this.parent) return "remove"
            judge.texture = textures[note.judge]
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

        events.Update.add(dt => {
            if (!this.parent) return "remove"
            if (state.paused) return
            this.children.forEach(x => {
                if (x instanceof InfoSprite || x instanceof InfoNumberSprite) {
                    x.update(dt)
                }
            })
        })
    }
}

