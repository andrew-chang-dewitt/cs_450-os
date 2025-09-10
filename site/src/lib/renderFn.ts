import { createDirectives } from "marked-directive"
import { Marked, type MarkedExtension } from "marked"
import markedAlert from "marked-alert"
import markedKatex from "marked-katex-extension"
import { RenderFn } from "vite-plugin-static-md/dist/options"

export type ExtBuilder = () => MarkedExtension

function makeRenderer(extensions?: ExtBuilder[]): RenderFn {
  const renderer = new Marked()
  // renderer.use(createDirectives())
  if (extensions) {
    extensions.forEach((ext) => {
      renderer.use(ext())
    })
  }

  // vite can't tell if Marked.parse is async version or not & errors when
  // calling Marked.parse(...).then(...); wrapping call to parse in this fn
  // solves that weird error
  async function renderMd(src: string): Promise<string> {
    return await renderer.parse(src)
  }

  return async (src) => {
    return {
      // main page content
      "main-content": await renderMd(src),
    }
  }
}

export default makeRenderer([markedKatex, markedAlert, createDirectives])
