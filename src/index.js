// Let use path aliases like src/main-process/windows instead of ../main-process/windows
require('module-alias/register')

const Promise = require('bluebird')
const { app, BrowserWindow } = require('electron')
const glob = require('glob')
const path = require('path')
const { execSync } = require('child_process')
const { readdirAsync, statAsync, renameAsync } = Promise.promisifyAll(require('fs'))
const { createMainWindow } = require('main-process/windows')

// Install Devtron in development and enable hot-reload for svelte components
if (process.env.NODE_ENV === 'development') {
	require('electron-debug')()
	require('electron-reload')('./**/*.html', {
		callback: () => { execSync('yarn build-components') }
	});
}

// Prevent window being garbage collected
let mainWindow
let currentPath = '/'

const openMainWindow = async () => {
	const files = await readdirAsync(currentPath)
	const enhancedFiles = await Promise.all(files.map(async f => {
		const stats = await statAsync(`${currentPath}${f}`)
		return Object.assign({}, stats, { path: `${currentPath}${f}` })
	}))
	mainWindow = createMainWindow({}, { files: enhancedFiles })
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

app.on('ready', async () => {
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
