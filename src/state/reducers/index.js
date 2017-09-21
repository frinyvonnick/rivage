const { options: { initialPath } } = require('package.json')
const { combineReducers } = require('redux')
const {
  SET_ADDRESS,
  SET_SEARCH,
  SET_IS_SEARCHING,
  SET_FILES,
} = require('state/actions')

const address = (state = initialPath, action) => {
  switch (action.type) {
  case SET_ADDRESS: {
    const { address } = action
    return address.endsWith('/') ? address : `${address}/`
  }
  default:
    return state
  }
}

const search = (state = '', action) => {
  switch (action.type) {
  case SET_SEARCH: {
    const { search } = action
    return search
  }
  default:
    return state
  }
}

const isSearching = (state = false, action) => {
  switch (action.type) {
  case SET_IS_SEARCHING: {
    const { isSearching } = action
    return isSearching
  }
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
  search,
  isSearching,
})
