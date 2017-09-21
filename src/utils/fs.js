const Promise = require('bluebird')
const path = require('path')
const {
  readdirAsync,
  statAsync,
  accessAsync,
  constants: { F_OK },
} = Promise.promisifyAll(require('fs'))

const getFileInfo = async (filePath, fileName) => {
  let stats
  try {
    stats = await statAsync(filePath)
  } catch (e) {
    return Promise.reject(e)
  }
  const name = fileName.split('/').pop()
  let info = Object.assign({}, stats, {
    path: filePath,
    name,
    isDirectory: stats.isDirectory(),
  })

  if (stats.isDirectory()) {
    info = Object.assign({}, info, { thumbnail: path.join(__dirname, '..', 'assets/images/file-icons/folder.svg') })
  } else {
    const extension = fileName.split('.').pop()
    const iconPath = path.join(__dirname, '..', `assets/images/file-icons/${extension}.svg`)
    try {
      await accessAsync(iconPath, F_OK)
      info = Object.assign({}, info, { thumbnail: iconPath })
    } catch (e) {
      info = Object.assign({}, info, { thumbnail: path.join(__dirname, '..', 'assets/images/file-icons/blank-file.svg') })
    }
  }

  return info
}

exports.getFiles = async pPath => {
  let files
  try {
    await accessAsync(pPath, F_OK)
    files = await readdirAsync(pPath)
  } catch (e) {
    Promise.reject(e)
  }
  return await Promise.all(files.map(f => {
    const filePath = path.join(pPath, f)
    try {
      return getFileInfo(filePath, f)
    } catch (e) {
      return Promise.resolve()
    }
  }))
}

const emitInfo = async (eventEmitter, filePath, fileName) => {
  try {
    const fileInfo = await getFileInfo(filePath, fileName)
    return eventEmitter.emit('file', fileInfo)
  } catch (e) {
    return Promise.resolve()
  }
}

const walk = async (eventEmitter, dir, predicate) => {
  let files = []
  try {
    files = await readdirAsync(dir)
  } catch (e) {
    return Promise.resolve()
  }

  return Promise.all(
    files.map(async fileName => {
      const filePath = path.join(dir, fileName)
      let stats
      try {
        stats = await statAsync(filePath)
      } catch (e) {
        return Promise.reject(e)
      }
      if (!stats) return Promise.resolve()
      if (stats.isDirectory()) {
        if (predicate(fileName, filePath)) {
          emitInfo(eventEmitter, filePath, fileName)
        }
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(walk(eventEmitter, filePath, predicate))
          }, 50)
        })
      }
      if (predicate(fileName, filePath)) {
        emitInfo(eventEmitter, filePath, fileName)
      }
      return Promise.resolve()
    })
  )
}

exports.walk = walk
