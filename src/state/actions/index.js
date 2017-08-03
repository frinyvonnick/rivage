const SET_ADDRESS = 'SET_ADDRESS'
exports.SET_ADDRESS = SET_ADDRESS
exports.setAddress = address => ({
  type: SET_ADDRESS,
  address,
})

const SET_FILES = 'SET_FILES'
exports.SET_FILES = SET_FILES
exports.setFiles = files => ({
  type: SET_FILES,
  files,
})
