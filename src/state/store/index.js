const { getMainStore } = require('./main.js')
const { getRendererStore } = require('./renderer.js')

exports.getStore = () => {
  const isRenderer = require('is-electron-renderer')
  if (isRenderer) return getRendererStore()
  return getMainStore()
}
