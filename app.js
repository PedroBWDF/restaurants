const express = require('express')
// const { engine } = require('express-handlebars')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})