// Let use path aliases like src/main-process/windows instead of ../main-process/windows
require('module-alias/register')

const {
  app,
  shell,
} = require('electron')
const { execSync } = require('child_process')

const { createMainWindow } = require('main-process/windows')
const { getFiles } = require('utils/fs')
const { createStore } = require('state/store')
const {
  setFiles,
  SET_ADDRESS,
  OPEN_ITEM,
} = require('state/actions')

// Install Devtron in development and enable hot-reload for svelte components
if (process.env.NODE_ENV === 'development') {
  require('electron-debug')()
  require('electron-reload')('./**/*.html', { callback: () => { execSync('yarn build-components') } })
}

const globalMiddleware = store => next => action => {

  const result = next(action)
  const nextState = store.getState()

  switch (action.type) {
  case SET_ADDRESS: {
    getFiles(nextState.address).then(files => {
      store.dispatch(setFiles(files))
    })
    break
  }
  case OPEN_ITEM: {
    shell.openItem(action.fullPath)
    break
  }
  default:

  }

  return result
}

// Init redux store
const store = createStore([globalMiddleware])
const state = store.getState()

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
