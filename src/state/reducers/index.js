const { options: { initialPath } } = require('package.json')
const { combineReducers } = require('redux')
const {
  SET_ADDRESS,
  SET_FILES,
} = require('state/actions')

const address = (state = initialPath, action) => {
  switch (action.type) {
  case SET_ADDRESS:
    return action.address
  default:
    return state
  }
}

const files = (state = [], action) => {
  switch (action.type) {
  case SET_FILES:
    return action.files
  default:
    return state
  }
}

module.exports = combineReducers({
  address,
  files,
})
