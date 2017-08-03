const {
  compose,
  createStore,
} = require('redux')
const { electronEnhancer } = require('redux-electron-store')
const reducer = require('state/reducers')

let store = null

// Note: passing enhancer as the last argument to createStore requires redux@>=3.1.0
exports.getMainStore = () => {
  if (store !== null) return store

  const enhancer = compose(
    // applyMiddleware(...middleware),
    // Must be placed after any enhancers which dispatch
    // their own actions such as redux-thunk or redux-saga
    electronEnhancer({
      // Necessary for synched actions to pass through all enhancers
      dispatchProxy: a => store.dispatch(a),
    })
  )

  store = createStore(reducer, {}, enhancer)
  return store
}
