import { Container, Sprite, Texture } from "pixi.js"
import { injectable } from "inversify"
import { SpriteInfo } from "../Common/InfoType"
import { GameState } from "../Core/GameState"
import { GameConfig } from "../Core/GameConfig"
import { Resources, GlobalEvents } from "../Utils/SymbolClasses"
import { InfoSprite } from "../Common/InfoSprite"
import { FixRatioContainer } from "../Common/FixRatioContainer"
import { LayerHeight, LayerWidth } from "../Core/Constants"


type PauseLayerInfo = {
    continue: SpriteInfo
    restart: SpriteInfo
    back: SpriteInfo
    other?: SpriteInfo[]
}

@injectable()
export class PauseLayer extends Container {
    constructor(state: GameState, config: GameConfig, resources: Resources, events: GlobalEvents) {
        super()

        const mask = new Sprite(Texture.WHITE)
        mask.tint = 0
        mask.alpha = 0.5

        const container = new FixRatioContainer(LayerWidth, LayerHeight)

        mask.width = events.Resize.prevArgs[0]
        mask.height = events.Resize.prevArgs[1]
        container.resize(...events.Resize.prevArgs)
        events.Resize.add((remove, w, h) => {
            if (!this.parent) return remove()
            mask.width = w
            mask.height = h
            container.resize(w, h)
        })

        mask.interactive = true
        mask.on("pointertap", (e: PointerEvent) => e.stopPropagation())

        this.addChild(mask)
        this.addChild(container)

        const info = resources.ui.data.info.pause as PauseLayerInfo
        const textures = resources.ui.textures

        if (info.other instanceof Array) {
            for (const x of info.other) {
                this.addChild(new InfoSprite(x, textures))
            }
        }

        const continuebtn = new InfoSprite(info.continue, textures)
        const restart = new InfoSprite(info.restart, textures)
        const back = new InfoSprite(info.back, textures)

        continuebtn.interactive = true
        //        continuebtn.buttonMode = true
        continuebtn.on("pointertap", () => {
            state.onContinue.emit()
        })

        restart.interactive = true
        //        restart.buttonMode = true
        restart.on("pointertap", () => {
            state.onRestart.emit()
        })

        back.interactive = true
        //        back.buttonMode = true
        back.on("pointertap", () => {
            state.onAbort.emit()
        })

        container.addChild(continuebtn, restart, back)

        events.Update.add((remove, dt) => {
            if (!this.parent) return remove()
            for (const x of this.children) {
                if (x instanceof InfoSprite) {
                    x.update(dt)
                }
            }
        })
    }
}
