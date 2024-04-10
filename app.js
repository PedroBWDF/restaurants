const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const methodOverride = require('method-override')
// 引用路由器
const router = require('./routes') 


const db = require('./models')
const Restaurant = db.Restaurant

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

const { Op } = require('sequelize');

app.get('/restaurants', (req, res) => {
  //使用query方法取得搜尋欄的關鍵字
  const keyword = req.query.keyword 

  let matchedRestaurantsPromise;

  if (keyword) {
    matchedRestaurantsPromise = Restaurant.findAll({
      //sequelize官方文件有針對Op.or和Op.like說明
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { category: { [Op.like]: `%${keyword}%` } }
        ]
      },
      raw: true
    });
  } else {
    matchedRestaurantsPromise = Restaurant.findAll({ raw: true });
  }

  matchedRestaurantsPromise
    .then((matchedRestaurants) => {
      // restaurants和keyword為渲染模板時用的名稱，可見index.hbs檔案
      res.render('index', { restaurants: matchedRestaurants, keyword });
    })
    .catch((error) => {
      console.error('Error fetching restaurants:', error);
      res.status(500).send('Error fetching restaurants');
    });
});


app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
  //利用req.body拿到POST方法傳過來的資料，會是一個物件，name為key、value為值
  const name = req.body.name 
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
    //findByPk查詢到的資料會被作為參數傳遞到.then的callback function
    .then((restaurant) => { 
      if (!restaurant) {
        res.status(404).send('Restaurant not found')
      }
      //restaurant為渲染模板時用的名稱
      res.render('detail', { restaurant }) 
    })

    .catch((err) => res.status(422).json(err))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, { 
    attributes: ['id', 'name', 'category', 'location', 'phone', 'image'],
  raw: true 
})
    //findByPk查詢到的資料會被作為參數傳遞到.then的callback function
    .then((restaurant) => {
      if (!restaurant) {
        res.status(404).send('Restaurant not found')
      }
      //restaurant為渲染模板時用的名稱
      res.render('edit', { restaurant })
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

// 將 request 導入路由器
app.use(router) 

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})