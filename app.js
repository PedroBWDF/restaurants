const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const methodOverride = require('method-override')
// const restaurants = require('./public/jsons/restaurant.json').results

const db = require('./models')
const Restaurant = db.Restaurant

// import express from 'express';
// import { engine } from 'express-handlebars';
// app.engine('handlebars', engine());

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

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

// app.get('/restaurants', (req, res) => {
//   return Restaurant.findAll({
//     raw: true //讓資料庫回傳資料時不會被包在dataValue的instance裡面，而是回傳js物件(官方文件說明)
//   })
//     .then((restaurants) => 
//     res.render('index', { restaurants })) //restaurants為渲染模板時用的名稱
//     .catch((err) => res.status(422).json(err))
// })

// app.get('/restaurants', (req, res) => {
//   const keyword = req.query.keyword
//   const matchedRests = keyword ? Restaurant.findall({ 
//     where:{
//       name: keyword,
//       category: keyword
//     } })((rest) =>
//     rest.name.toLowerCase().includes(keyword.toLowerCase()) || rest.category.toLowerCase().includes(keyword.toLowerCase()))
//     : restaurants
//   res.render('index', { restaurants: matchedRests, keyword })
// })

const { Op } = require('sequelize');

app.get('/restaurants', (req, res) => {
  const keyword = req.query.keyword //使用query方法取得搜尋欄的關鍵字

  let matchedRestaurantsPromise;

  if (keyword) {
    matchedRestaurantsPromise = Restaurant.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { category: { [Op.like]: `%${keyword}%` } }
        ]
      }, //sequelize官方文件有針對Op.or和Op.like說明
      raw: true
    });
  } else {
    matchedRestaurantsPromise = Restaurant.findAll({ raw: true });
  }

  matchedRestaurantsPromise
    .then((matchedRestaurants) => {
      res.render('index', { restaurants: matchedRestaurants, keyword });
    }) // restaurants和keyword為渲染模板時用的名稱，可見index.hbs檔案
    .catch((error) => {
      console.error('Error fetching restaurants:', error);
      res.status(500).send('Error fetching restaurants');
    });
});





// //根據express官方文件設計動態路由，並取得id以渲染特定餐廳詳細資料
// app.get('/restaurant/:id', (req, res) => {
//   const id = req.params.id
//   const restaurant = restaurants.find((rest) => rest.id.toString() === id)
//   res.render('detail', { restaurant })
// })

app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
  const name = req.body.name //利用req.body拿到POST方法傳過來的資料，會是一個物件，name為key、value為值
  const category = req.body.category
  const location = req.body.location
  const phone = req.body.phone
  const image = req.body.image

  return Restaurant.create({ name, category, location, phone, image })
    .then(() => res.redirect('/restaurants'))
    .catch((err) => console.log(err))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'category', 'location', 'phone', 'image'],
    raw: true 
  }) //有沒有return都可，but why?
    .then((restaurant) => { //findByPk查詢到的資料會被作為參數傳遞到.then的callback function
      if (!restaurant) {
        res.status(404).send('Restaurant not found')
      }
      res.render('detail', { restaurant }) //restaurant為渲染模板時用的名稱
    })

    .catch((err) => res.status(422).json(err))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, { 
    attributes: ['id', 'name', 'category', 'location', 'phone', 'image'],
  raw: true 
}) //有沒有return都可，but why?
    .then((restaurant) => { //findByPk查詢到的資料會被作為參數傳遞到.then的callback function
      if (!restaurant) {
        res.status(404).send('Restaurant not found')
      }
      res.render('edit', { restaurant }) //restaurant為渲染模板時用的名稱
    })

    .catch((err) => res.status(422).json(err))
})

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const body = req.body

  Restaurant.update({ name: body.name, category: body.category, location: body.location, phone: body.phone, image: body.image }, {
    where: { id }
  })
  .then(() => res.redirect(`/restaurants/${id}`))
})

app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id

  return Restaurant.destroy({ where: { id } })
    .then(() => res.redirect('/restaurants'))
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})