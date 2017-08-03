const { noop } = require('lodash')

const shallowEqualObjects = require('shallow-equal/objects')
const { getStore } = require('state/store')

// eslint-disable-next-line no-empty-function
module.exports = (mapStateToProps = noop, mapDispatchToProps = noop) => Component => {
  let instance
  let data
  let options
  const store = getStore()

  const getNextData = (state, data, dispatch) => {
    const stateToProps = mapStateToProps(state, data)
    const dispatchToProps = mapDispatchToProps(dispatch, data)

    return Object.assign({}, data, stateToProps, dispatchToProps)
  }

  store.subscribe(() => {
    const nextData = getNextData(store.getState(), options.data, store.dispatch)

    if (!shallowEqualObjects(data, nextData)) {
      data = nextData
      instance.set(data)
    }
  })

  return function(pOptions) {
    options = pOptions
    const nextData = getNextData(store.getState(), options.data, store.dispatch)
    data = nextData
    const newOptions = Object.assign({}, options, { data })

    instance = new Component(newOptions)

    return instance
  }
}
