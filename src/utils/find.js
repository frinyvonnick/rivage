const EventEmitter = require('events')
const { walk } = require('./fs.js')

process.on('message', m => {
  console.log('CHILD got message:', m)
  if (m.type === 'find') {
    const {
      address,
      term,
    } = m.options

    const eventEmitter = new EventEmitter()
    eventEmitter.on('file', file => {
      process.send({
        type: 'file',
        file,
      })
    })
    const predicate = filename => {
      console.log(`${filename}.includes(${term})`, filename.includes(term))
      return filename.includes(term)
    }

    walk(eventEmitter, address, predicate)
      .then(() => process.send({ type: 'finish' }))
  }
})
