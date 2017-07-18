// Let use path aliases like src/main-process/windows instead of ../main-process/windows
require('module-alias/register')

const { app } = require('electron')
const glob = require('glob')
const path = require('path')
const { execSync } = require('child_process')

const { createMainWindow } = require('main-process/windows')
const { getFiles } = require('utils/fs')
const { options: { initialPath } } = require('package.json')

// Install Devtron in development and enable hot-reload for svelte components
if (process.env.NODE_ENV === 'development') {
  require('electron-debug')()
  require('electron-reload')('./**/*.html', { callback: () => { execSync('yarn build-components') } })
}

// Prevent window being garbage collected
let mainWindow

const openMainWindow = async () => {
  const files = await getFiles(initialPath)
  mainWindow = createMainWindow({}, { files })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit()

})

app.on('activate', () => {
  if (!mainWindow)
    openMainWindow()

})

app.on('ready', () => {
  openMainWindow()
})

const loadDependencies = async () => {
  // Require each JS file in the main-process/listeners dir
  const dependencies = await glob.sync(path.join(__dirname, 'main-process/listeners/**/*.js'))
  dependencies.forEach((file) => {
    require(file)
  })
}

loadDependencies()
