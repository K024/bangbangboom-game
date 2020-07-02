import { FixRatioContainer } from "../Common/FixRatioContainer"
import { injectable } from "inversify"
import { LayerWidth, LayerHeight } from "../Core/Constants"
import { Text, Container, TilingSprite, Texture, Graphics } from "pixi.js"
import { LoadingBackground, LoadingMessages } from "../Utils/InCodeAssests"
import { GlobalEvents } from "../Utils/SymbolClasses"
import {
    AnimationManager,
    CreatePixiPropSetter,
    createSimpleAnimation,
    keyFramePresets,
} from "../Common/Animation/Animation"
import { GameEvent } from "../Common/GameEvent"
import { GameLoadConfig } from "../Core/GameConfig"

class LoadProgress {
    progress = 0

    targetProgress = 0

    set(target: number) {
        this.targetProgress = target
        if (target >= 1) this.finished = true
    }

    private finished = false

    /**
     *
     * @param dt 以秒计
     */
    update(dt: number) {
        this.progress += dt * (this.targetProgress - this.progress) * 5

        if (this.finished) {
            this.progress += dt * 0.1
            if (this.progress > 1) {
                this.progress = 1
                return true
            }
        }
    }
}

@injectable()
export class LoadingLayer extends Container {
    progress = new LoadProgress()

    constructor(events: GlobalEvents, config: GameLoadConfig) {
        super()

        const backtexture = Texture.from(LoadingBackground)
        const back = new TilingSprite(backtexture, ...events.Resize.prevArgs)
        this.addChild(back)

        const container = new FixRatioContainer(LayerWidth, LayerHeight)
        container.resize(...events.Resize.prevArgs)

        const text = new Text(LoadingMessages[0], {
            fontSize: 72,
            fill: "white",
        })
        text.position.set(400, 330)
        text.scale.set(0.5)
        container.addChild(text)

        const barback = new Graphics().beginFill(0x808080).drawRoundedRect(0, 0, 480, 18, 8).endFill()
        barback.position.set(400, 380)
        container.addChild(barback)

        const bar = new Graphics()
        bar.position.set(400, 380)
        container.addChild(bar)
        this.addChild(container)

        const textanim = this.setTextAnim(text, events.Update)

        events.Resize.add((remove, w, h) => {
            if (!this.parent) return remove()

            back.width = w
            back.height = h

            back.tileScale.set(Math.max(w, h) / 1000)
            container.resize(w, h)
        })

        let lastProg = 0
        events.Update.add((remove, dt) => {
            if (!this.parent) return remove()

            back.tilePosition.x += dt * 20
            back.tilePosition.y += dt * 10

            textanim.update(dt)

            this.progress.update(dt)
            const progress = this.progress.progress
            if (progress > 0.04 && lastProg !== progress) {
                lastProg = progress
                bar.clear()
                    .beginFill(0xe93f5f)
                    .drawRoundedRect(0, 0, 480 * progress, 18, 8)
                    .endFill()
            }
        })

        this.messages = config.loadingMessages || LoadingMessages
    }

    private messages: string[]

    getRandomMessage(prev = "") {
        let str = prev
        while (str === prev) {
            const i = Math.floor(Math.random() * this.messages.length)
            str = this.messages[i]
        }
        return str
    }

    setTextAnim(text: Text, update: GameEvent<[number, number]>) {
        let timeout = 5

        const textanim = new AnimationManager(CreatePixiPropSetter(text))
        textanim.paused = true

        const anim1 = createSimpleAnimation(1, 0, 0.3, keyFramePresets.easeOut)
        const anim2 = createSimpleAnimation(text.x, text.x - 20, 0.3, keyFramePresets.easeOut)
        const changeText = () => {
            if (!this.parent) return
            textanim.paused = false
            textanim.animations.set("alpha", anim1)
            textanim.animations.set("x", anim2)
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            textanim.onEnd.add(changeText2)
        }
        const anim3 = createSimpleAnimation(0, 1, 0.3, keyFramePresets.easeOut)
        const anim4 = createSimpleAnimation(text.x + 20, text.x, 0.3, keyFramePresets.easeOut)
        const changeText2 = (remove: () => void) => {
            text.text = this.getRandomMessage(text.text)
            textanim.currentTime = 0
            textanim.animations.set("alpha", anim3)
            textanim.animations.set("x", anim4)
            textanim.onEnd.add(remove => {
                textanim.paused = true
                textanim.currentTime = 0

                timeout = 5
                return remove()
            })
            return remove()
        }

        update.add((remove, dt) => {
            if (!this.parent) return remove()
            timeout -= dt
            if (timeout < 0 && timeout + dt >= 0) changeText()
        })

        return textanim
    }
}
