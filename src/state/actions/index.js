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

const OPEN_ITEM = 'OPEN_ITEM'
exports.OPEN_ITEM = OPEN_ITEM
exports.openItem = fullPath => ({
  type: OPEN_ITEM,
  fullPath,
})

const GO_LEVEL_UP = 'GO_LEVEL_UP'
exports.GO_LEVEL_UP = GO_LEVEL_UP
exports.goLevelUp = () => ({ type: GO_LEVEL_UP })

const SET_SEARCH = 'SET_SEARCH'
exports.SET_SEARCH = SET_SEARCH
exports.setSearch = search => ({
  type: SET_SEARCH,
  search,
})

const SET_IS_SEARCHING = 'SET_IS_SEARCHING'
exports.SET_IS_SEARCHING = SET_IS_SEARCHING
exports.setIsSearching = isSearching => ({
  type: SET_IS_SEARCHING,
  isSearching,
})
