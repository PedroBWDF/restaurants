const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000

// import express from 'express';
// import { engine } from 'express-handlebars';
// app.engine('handlebars', engine());

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs');
app.set('views', './views');

//根據express文件，載入餐廳json靜態資料
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

app.get('/restaurants', (req, res) => {
  res.render('index')
})

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  res.send(`read restaurant: ${id}`)
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})