import { injectable } from "inversify";
import { MainStage, GlobalEvents } from "./SymbolClasses";
import { Animation, AnimationManager, CreatePixiTargetPropMapper, createSimpleAnimation, keyFramePresets } from "../Common/Animation";
import { Container } from "pixi.js";
import { GameEvent } from "./GameEvent";


@injectable()
export class SceneSwitcher {
    constructor(private stage: MainStage, private events: GlobalEvents) { }

    switch(from: Container, to: Container, outTime = 0.6, inTime = 0.6, inDelay = 0) {
        const outAnim = new AnimationManager(CreatePixiTargetPropMapper(from))
        const inAnim = new AnimationManager(CreatePixiTargetPropMapper(to))
        to.alpha = 0
        outAnim.animations.set("alpha", createSimpleAnimation(1, 0, outTime, keyFramePresets.easeOut))
        inAnim.animations.set("alpha", createSimpleAnimation(0, 1, inTime, keyFramePresets.easeOut))

        let ended = 0
        this.events.Update.add(dt => {
            if (outAnim.ended) return "remove"
            outAnim.update(dt)
            if (outAnim.currentTime > inDelay)
                inAnim.update(dt)
        })

        const i = this.stage.getChildIndex(from)
        this.stage.addChildAt(to, i)

        inAnim.onEnd.add(() => {
            ended++
        })
        outAnim.onEnd.add(() => {
            this.stage.removeChild(from)
            ended++
        })

        return {
            inEnd: inAnim.onEnd,
            outEnd: outAnim.onEnd,
        }
    }
}


