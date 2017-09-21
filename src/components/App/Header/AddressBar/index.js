const { connect } = require('utils/connect')
const {
  setAddress,
} = require('state/actions')

const {
  getAddress,
  getFoldersForAddress,
} = require('state/selectors')

const mapStateToData = state => ({
  address: getAddress(state),
  availableAddresses: getFoldersForAddress(state),
})

const mapDispatchToData = dispatch => ({
  setAddress: path => dispatch(setAddress(path)),
})

exports.AddressBar = connect(mapStateToData, mapDispatchToData)(require('./AddressBar'))
