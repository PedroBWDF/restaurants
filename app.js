const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
// const restaurants = require('./public/jsons/restaurant.json').results

const db = require('./models')
const Restaurant = db.Restaurant

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

// app.get('/restaurants', (req, res) => {
//   const keyword = req.query.keyword
//   const matchedRests = keyword ? restaurants.filter((rest) =>
//     rest.name.toLowerCase().includes(keyword.toLowerCase()) || rest.category.toLowerCase().includes(keyword.toLowerCase()))
//     : restaurants
//   res.render('index', { restaurants: matchedRests, keyword })
// })

app.get('/restaurants', (req, res) => {
  return Restaurant.findAll({
    raw: true //讓資料庫回傳資料時不會被包在dataValue的instance裡面，而是回傳js物件(官方文件說明)
  })
    .then((restaurants) => 
    res.render('index', { restaurants })) //restaurants為渲染模板時用的名稱
    .catch((err) => res.status(422).json(err))
})


// //根據express官方文件設計動態路由，並取得id以渲染特定餐廳詳細資料
// app.get('/restaurant/:id', (req, res) => {
//   const id = req.params.id
//   const restaurant = restaurants.find((rest) => rest.id.toString() === id)
//   res.render('detail', { restaurant })
// })

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, { raw: true })
    .then((restaurant) => { //findByPk查詢到的資料會被作為參數傳遞到.then的callback function
      if(!restaurant) {
        res.status(404).send('Restaurant not found')
      }
      res.render('detail', { restaurant }) //restaurant為渲染模板時用的名稱
    })

    .catch((err) => res.status(422).json(err))
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})