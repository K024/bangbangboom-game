import { Container, Sprite, Texture } from "pixi.js"
import { injectable } from "inversify"
import { Resources, GlobalEvents } from "../../Utils/SymbolClasses"
import { AnimationManager, CreatePixiTargetPropMapper } from "../../Common/Animation"
import { LaneBottomY, LaneCenterXs } from "../../Core/Constants"
import { GameState } from "../../Core/GameState"
import { GameConfig } from "../../Core/GameConfig"

export class LaneEffect extends Sprite {
    constructor(texture: Texture, flip = false) {
        super(texture)
        this.anim.targetPropMapper = CreatePixiTargetPropMapper(this)
        this.anim.animations.set("scalex", {
            keyframes: [{ time: 0, value: flip ? -1 : 1, type: "bezier", ctrl: [1, 0, 1, 1] },
            { time: 0.25, value: flip ? -0.4 : 0.4, type: "static" }],
            totaltime: 0.25
        })
        this.anim.animations.set("scaley", {
            keyframes: [{ time: 0, value: 1, type: "bezier", ctrl: [1, 0, 1, 1] },
            { time: 0.25, value: 0.4, type: "static" }],
            totaltime: 0.25
        })
        this.anim.animations.set("alpha", {
            keyframes: [{ time: 0, value: 0.8, type: "bezier", ctrl: [.42, 0, 1, 1] },
            { time: 0.25, value: 0, type: "static" }],
            totaltime: 0.25
        })
        this.anim.onEnd.add(() => {
            this.visible = false
        })
    }

    private anim = new AnimationManager()

    setAnim() {
        this.visible = true
        this.anim.currentTime = 0
    }

    update(dt: number) {
        if (!this.visible) return
        this.anim.update(dt)
    }
}

@injectable()
export class LaneEffectLayer extends Container {
    constructor(resources: Resources, state: GameState, events: GlobalEvents, config: GameConfig) {
        super()

        if (!config.laneEffect) return

        const list = [0.166, 0.23, 0.36, 0.5]

        const effects = [0, 1, 2, 3, 4, 5, 6].map(x => {
            const i = (3 - Math.abs(x - 3))
            const e = new LaneEffect(resources.game.textures!["bg_line" + i], x > 3)
            e.y = LaneBottomY
            e.x = LaneCenterXs[x]
            e.visible = false
            e.anchor.set(list[i], 1)
            return e
        })

        this.addChild(...effects)

        events.Update.add((remove, dt) => {
            if (state.ended) return remove()
            if (state.paused) return
            effects.forEach(x => x.update(dt))
        })

        state.onJudge.add((remove, n) => {
            if (n.judge !== "miss")
                effects[n.lane].setAnim()
        })

        state.onEmptyTap.add((remove, l) => {
            effects[l].setAnim()
        })

    }
}
