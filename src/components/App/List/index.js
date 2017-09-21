const { connect } = require('utils/connect')

const mapStateToData = ({ files }) => ({
  files,
})

exports.List = connect(mapStateToData)(require('./List'))
