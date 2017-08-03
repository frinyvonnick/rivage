// Let use path aliases like src/main-process/windows instead of ../main-process/windows
require('module-alias/register')

const { app } = require('electron')
const { execSync } = require('child_process')

const { createMainWindow } = require('main-process/windows')
const { getFiles } = require('utils/fs')
const { getStore } = require('state/store')
const { setFiles } = require('state/actions')

// Install Devtron in development and enable hot-reload for svelte components
if (process.env.NODE_ENV === 'development') {
  require('electron-debug')()
  require('electron-reload')('./**/*.html', { callback: () => { execSync('yarn build-components') } })
}

// Init redux store
const store = getStore()
let state = store.getState()
store.subscribe(() => {
  const nextState = store.getState()

  if (state.address !== nextState.address) {
    getFiles(nextState.address).then(files => {
      store.dispatch(setFiles(files))
    })
  }

  state = nextState
})

getFiles(state.address).then(files => {
  store.dispatch(setFiles(files))
})

// Prevent window being garbage collected
let mainWindow

const openMainWindow = () => {
  const { files } = state
  mainWindow = createMainWindow({}, { files })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!mainWindow) {
    openMainWindow()
  }
})

app.on('ready', () => {
  openMainWindow()
})
