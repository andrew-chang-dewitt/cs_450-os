import { createDirectives } from "marked-directive"
import hljs from "highlight.js"
import { Marked, type MarkedExtension } from "marked"
import markedAlert from "marked-alert"
import { markedHighlight } from "marked-highlight"
import type { RenderFn } from "vite-plugin-static-md/dist/options"

export type ExtBuilder = () => MarkedExtension

function makeRenderer(extensions?: ExtBuilder[]): RenderFn {
  const marked = new Marked()
  // renderer.use(createDirectives())
  if (extensions) {
    marked.use(...extensions.map((e) => e()))
  }

  // vite can't tell if Marked.parse is async version or not & errors when
  // calling Marked.parse(...).then(...); wrapping call to parse in this fn
  // solves that weird error
  async function renderMd(src: string): Promise<string> {
    return await marked.parse(src)
  }

  return async (src) => {
    return {
      // main page content
      "main-content": await renderMd(src),
    }
  }
}

function codeHighlighter() {
  return markedHighlight({
    emptyLangClass: "",
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      // include option for skipping highlighting
      if (info.includes("no-hljs")) return code

      const language = hljs.getLanguage(lang) ? lang : "plaintext"
      const hlghtd = hljs.highlight(code, { language }).value
      return hlghtd
    },
  })
}

export default makeRenderer([codeHighlighter, markedAlert, createDirectives])
