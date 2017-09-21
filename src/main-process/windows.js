const window = require('electron-window')
const path = require('path')

const createWindow = ({ file, data = {}, options = {} }) => {
  const opts = Object.assign(
    {},
    {
      width: 1000,
      height: 800,
    },
    options
  )

  const newWindow = window.createWindow(opts)
  const someArgs = Object.assign({}, data, { isDevelopmentEnv: process.env.NODE_ENV === 'development' })

  newWindow.showUrl(file, someArgs)

  return newWindow
}

exports.createWindow = createWindow

exports.createMainWindow = (options = {}, data = {}) => {
  return createWindow({
    file: path.resolve(__dirname, '..', 'windows', 'index.html'),
    data,
    options,
  })
}
