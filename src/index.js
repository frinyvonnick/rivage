// Let use path aliases like src/main-process/windows instead of ../main-process/windows
require('module-alias/register')

process.on('unhandledRejection', (reason, p) => {
  // eslint-disable-next-line
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

const {
  app,
  shell,
  BrowserWindow, // eslint-disable-line
} = require('electron')
const {
  execSync,
  fork,
} = require('child_process')

const { createMainWindow } = require('main-process/windows')
const { getFiles } = require('utils/fs')
const finder = fork(`${__dirname}/utils/find.js`)

const path = require('path')
const { createStore } = require('state/store')
const {
  setFiles,
  SET_ADDRESS,
  OPEN_ITEM,
  GO_LEVEL_UP,
  SET_SEARCH,
} = require('state/actions')

const {
  setAddress,
  setIsSearching,
} = require('state/actions')
const {
  getAddress,
  getSearch,
} = require('state/selectors')

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
    getFiles(getAddress(nextState))
      .then(files => {
        store.dispatch(setFiles(files))
      })
      .catch(() => {
        // Pass error
      })
    break
  }
  case OPEN_ITEM: {
    shell.openItem(action.fullPath)
    break
  }
  case GO_LEVEL_UP: {
    const address = getAddress(nextState)
    store.dispatch(setAddress(path.dirname(address)))
    break
  }
  case SET_SEARCH: {
    const address = getAddress(nextState)
    const search = getSearch(nextState)

    store.dispatch(setFiles([]))
    store.dispatch(setIsSearching(true))

    finder.send({
      type: 'find',
      options: {
        address,
        term: search,
      },
    })

    finder.on('message', m => {
      switch (m.type) {
      case 'file': {
        store.dispatch(setFiles([...store.getState().files, m.file]))
        break
      }
      default:
        store.dispatch(setIsSearching(false))
      }
    })
    break
  }
  default:

  }

  return result
}

// Init redux store
const store = createStore([
  globalMiddleware,
])
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
