import { FixRatioContainer } from "../Common/FixRatioContainer"
import { InfoSprite } from "../Common/InfoObject/InfoSprite"
import { PositionInfo, SpriteInfo, setPositionInfo } from "../Common/InfoObject/InfoType"
import { TextStyle, Text } from "pixi.js"
import { injectable } from "inversify"
import { LayerWidth, LayerHeight } from "../Core/Constants"
import { Resources, GlobalEvents } from "../Utils/SymbolClasses"
import { GameLoadConfig } from "../Core/GameConfig"

type ReadyLayerInfo = {
    play: SpriteInfo
    auto: SpriteInfo
    name?: {
        position: PositionInfo
        style: TextStyle
    }
    other?: SpriteInfo[]
}

@injectable()
export class ReadyLayer extends FixRatioContainer {
    constructor(resources: Resources, loadcfg: GameLoadConfig, events: GlobalEvents) {
        super(LayerWidth, LayerHeight)

        this.resize(...events.Resize.prevArgs)
        events.Resize.add((remove, w, h) => {
            if (!this.parent) return remove()
            this.resize(w, h)
        })

        const info = resources.ui.data.info.ready as ReadyLayerInfo
        const textures = resources.ui.textures

        if (info.other instanceof Array) {
            for (const x of info.other) {
                this.addChild(new InfoSprite(x, textures))
            }
        }

        const playbtn = new InfoSprite(info.play, textures)
        this.addChild(playbtn)
        const autobtn = new InfoSprite(info.auto, textures)
        this.addChild(autobtn)
        if (info.name) {
            const name = new Text(loadcfg.songName, info.name.style)
            setPositionInfo(name, info.name.position)
            this.addChild(name)
        }

        playbtn.interactive = true
        //        playbtn.buttonMode = true
        autobtn.interactive = true
        //        autobtn.buttonMode = true

        playbtn.once("pointertap", () => this.start())
        autobtn.once("pointertap", () => this.start(true))

        events.Update.add((remove, dt) => {
            if (!this.parent) return remove()
            for (const x of this.children) {
                if (x instanceof InfoSprite) {
                    x.update(dt)
                }
            }
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    start = (auto = false) => {
        /** */
    }
}
