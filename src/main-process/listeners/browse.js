const { ipcMain } = require('electron')
const { getFiles } = require('utils/fs')
const { options: { initialPath } } = require('package.json')

let currentPath = initialPath

ipcMain.on('change-path', async (e, newPath) => {
  currentPath = newPath
  const files = await getFiles(currentPath)
  e.sender.send('files-sent', files)
})
