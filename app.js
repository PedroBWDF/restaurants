const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const restaurants = require('./public/jsons/restaurant.json').results

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
  const keyword = req.query.keyword
  const matchedRests = keyword ? restaurants.filter((rest) =>
    rest.name.toLowerCase().includes(keyword.toLowerCase()) || rest.category.toLowerCase().includes(keyword.toLowerCase()))
    : restaurants
  res.render('index', { restaurants: matchedRests, keyword })
})


app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((rest) => rest.id.toString() === id)
  res.render('detail', { restaurant })
})

//根據express官方文件設計動態路由，並取得id以渲染特定餐廳詳細資料
app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((rest) => rest.id.toString() === id)
  res.render('detail', { restaurant })
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})