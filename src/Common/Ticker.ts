const now = () => performance.now() / 1000

export class Ticker {
    /** delta and now are in seconds */
    Tick = new Set<(delta: number, now: number) => void>()
    private lasttime = 0
    private StopFlag = true
    private EndFlag = true
    SkipFrame = 0

    Start() {
        if (!this.EndFlag) return
        this.StopFlag = false

        let skipframecounter = 0
        const func = () => {
            this.EndFlag = false
            if (this.StopFlag) {
                this.EndFlag = true
                return
            }

            requestAnimationFrame(func)

            if (skipframecounter > 0) {
                skipframecounter--
                return
            }
            skipframecounter = this.SkipFrame

            const n = now()
            if (this.Tick) {
                for (const t of this.Tick) t(n - this.lasttime, n)
            }

            this.lasttime = n
        }
        this.lasttime = now()
        func()
    }

    Stop() {
        this.StopFlag = true
    }
}
