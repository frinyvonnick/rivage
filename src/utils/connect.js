const {
  noop,
  cloneDeep,
} = require('lodash')

const shallowEqualObjects = require('shallow-equal/objects')
const { getStore } = require('state/store')

// eslint-disable-next-line no-empty-function
exports.connect = (mapStateToData = noop, mapDispatchToData = noop) => Component => {
  const store = getStore()

  const getNextData = (state, data, dispatch) => {
    const stateToData = mapStateToData(state, data)
    const dispatchToData = mapDispatchToData(dispatch, data)

    return Object.assign({}, data, stateToData, dispatchToData)
  }

  return function(pOptions) {
    const options = cloneDeep(pOptions)

    const nextData = getNextData(store.getState(), options.data, store.dispatch)
    let data = nextData
    const newOptions = Object.assign({}, options, { data })

    const instance = new Component(newOptions)

    let justUpdate = false
    let isDestroying = false

    const updateIfNeccessary = () => {
      const nextData = getNextData(store.getState(), instance._state, store.dispatch)
      if (!shallowEqualObjects(data, nextData)) {
        data = nextData
        instance.set(data)
      }
    }

    const unsubscribe = store.subscribe(() => {
      if (isDestroying) return
      justUpdate = true

      updateIfNeccessary()
    })

    const observers = Object.keys(instance._state).map(k => {
      return instance.observe(k, (newValue, oldValue) => {
        if (oldValue === undefined) return
        if (justUpdate) return
        justUpdate = false

        updateIfNeccessary()
      })
    })

    instance.on('destroy', () => {
      isDestroying = true
      unsubscribe()
      observers.forEach(o => o.cancel())
    })

    return instance
  }
}
