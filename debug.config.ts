
interface DebugConfig {
  themeSrc : string
  themeDir : string
  namespace : string
}

export const debug : DebugConfig = {
  // relative to stencil 'src'
  themeSrc: "themes/starter/src/",
  themeDir: "server/wp-content/themes/",
  namespace: "starter"
}
