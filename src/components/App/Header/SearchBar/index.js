const { connect } = require('utils/connect')
const {
  setSearch,
} = require('state/actions')

const {
  getSearch,
} = require('state/selectors')

const mapStateToData = state => ({
  search: getSearch(state),
})

const mapDispatchToData = dispatch => ({
  setSearch: search => dispatch(setSearch(search)),
})

exports.SearchBar = connect(mapStateToData, mapDispatchToData)(require('./SearchBar'))
