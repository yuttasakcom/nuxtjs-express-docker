
const express = require('express')
const mongoose = require('mongoose')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const port = process.env.PORT || '3000'

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/nuxt')
mongoose.connection
  .once('open', () => {
    console.log('connect mongodb')
  })
  .on('error', err => {
    console.log('error', err)
  })

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Routes
const routes = require('./routes')
app.use(routes)

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port)
  console.log('Server listening on http://localhost:' + port) // eslint-disable-line no-console
}
start()
