import { injectable } from "inversify"
import { MainStage, GlobalEvents } from "../Utils/SymbolClasses"
import {
    AnimationManager,
    CreatePixiPropSetter,
    createSimpleAnimation,
    keyFramePresets,
} from "../Common/Animation/Animation"
import { Container } from "pixi.js"

@injectable()
export class SceneSwitcher {
    constructor(private stage: MainStage, private events: GlobalEvents) {}

    switch(from: Container, to: Container, outTime = 0.6, inTime = 0.6, inDelay = 0) {
        const outAnim = new AnimationManager(CreatePixiPropSetter(from))
        const inAnim = new AnimationManager(CreatePixiPropSetter(to))
        to.alpha = 0
        outAnim.animations.set("alpha", createSimpleAnimation(1, 0, outTime, keyFramePresets.easeOut))
        inAnim.animations.set("alpha", createSimpleAnimation(0, 1, inTime, keyFramePresets.easeOut))

        this.events.Update.add((remove, dt) => {
            if (outAnim.ended) return remove()
            outAnim.update(dt)
            if (outAnim.currentTime > inDelay) inAnim.update(dt)
        })

        const i = this.stage.getChildIndex(from)
        this.stage.addChildAt(to, i)

        outAnim.onEnd.add(() => {
            this.stage.removeChild(from)
        })

        return {
            inEnd: inAnim.onEnd,
            outEnd: outAnim.onEnd,
        }
    }
}
