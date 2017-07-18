const Promise = require('bluebird')
const path = require('path')
const {
  readdirAsync,
  statAsync,
  accessAsync,
  constants: { F_OK },
} = Promise.promisifyAll(require('fs'))

exports.getFiles = async (pPath) => {
  const files = await readdirAsync(pPath)
  return await Promise.all(files.map(async f => {
    const filePath = path.join(pPath, f)
    const stats = await statAsync(filePath)
    const name = f.split('/').pop()
    let info = Object.assign({}, stats, {
      path: filePath,
      name,
      isDirectory: stats.isDirectory(),
    })

    if (stats.isDirectory())
      info = Object.assign({}, info, { thumbnail: path.join(__dirname, '..', 'assets/images/file-icons/folder.svg') })
    else {
      const extension = f.split('.').pop()
      const iconPath = path.join(__dirname, '..', `assets/images/file-icons/${extension}.svg`)
      try {
        await accessAsync(iconPath, F_OK)
        info = Object.assign({}, info, { thumbnail: iconPath })
      } catch (e) {
        info = Object.assign({}, info, { thumbnail: path.join(__dirname, '..', 'assets/images/file-icons/blank-file.svg') })
      }
    }

    return info
  }))
}
