const { connect } = require('utils/connect')
const {
  goLevelUp,
} = require('state/actions')

const mapDispatchToData = dispatch => ({
  goLevelUp: () => dispatch(goLevelUp()),
})

exports.LevelUp = connect(undefined, mapDispatchToData)(require('./LevelUp'))
