exports.getAddress = state => state.address

exports.getSearch = state => state.search

exports.isSearching = state => state.isSearching

exports.getFoldersForAddress = state => state.files
  .filter(f => f.isDirectory)
  .map(f => f.name)
