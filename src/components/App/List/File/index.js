const connect = require('utils/connect')
const {
  setAddress,
  openItem,
} = require('state/actions')

const mapDispatchToData = (dispatch, { path }) => {
  return ({
    setAddress: () => dispatch(setAddress(path)),
    openItem: () => dispatch(openItem(path)),
  })
}

module.exports = connect(undefined, mapDispatchToData)(require('./File'))
