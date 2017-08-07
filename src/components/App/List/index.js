const connect = require('utils/connect')

const mapStateToData = ({ files }) => ({
  files,
})

module.exports = connect(mapStateToData)(require('./List'))
