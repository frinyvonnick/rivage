const {
  compose,
  createStore,
} = require('redux')
const { electronEnhancer } = require('redux-electron-store')
const reducer = require('state/reducers')

let store = null
// Note: passing enhancer as the last argument to createStore requires redux@>=3.1.0
exports.getRendererStore = () => {
  if (store !== null) return store

  const enhancer = compose(
    // applyMiddleware(...middleware),
    electronEnhancer({ dispatchProxy: a => store.dispatch(a) }),
    require('remote-redux-devtools').default()
  )

  store = createStore(reducer, {}, enhancer)
  return store
}
