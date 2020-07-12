
interface DebugConfig {
  themeSrc : string
  themeDir : string
  namespace : string
}

export const debug : DebugConfig = {
  // relative to stencil 'src'
  themeSrc: "themes/starter/src/",
  //themeDir: '../badgerherald.org/server/wp-content/themes/'
  themeDir: "server/wp-content/themes/",
  namespace: "badgerheraldorg"
}
