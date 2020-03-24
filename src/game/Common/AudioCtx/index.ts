import globalctx from "./GlobalCtx"
import MyEvent from "./MyEvent"
import AudioSource from "./AudioSource"
import AudioInstance from "./AudioInstance"
import AudioElInstance from "./AudioElInstance"

export default globalctx
export { MyEvent, AudioSource, AudioInstance, AudioElInstance }

export async function loadFromUrl(url: string) {
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()
  return buffer
}

