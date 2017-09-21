const {
  getMainStore,
  createMainStore,
} = require('./main.js')
const {
  getRendererStore,
  createRendererStore,
} = require('./renderer.js')

exports.getStore = () => {
  const isRenderer = require('is-electron-renderer')
  if (isRenderer) return getRendererStore()
  return getMainStore()
}

exports.createStore = (middlewares) => {
  const isRenderer = require('is-electron-renderer')
  if (isRenderer) return createRendererStore(middlewares)
  return createMainStore(middlewares)
}
