const { connect } = require('utils/connect')
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

exports.File = connect(undefined, mapDispatchToData)(require('./File'))
