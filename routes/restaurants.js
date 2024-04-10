const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

const { Op } = require('sequelize');

router.get('/', (req, res) => {
  //使用query方法取得搜尋欄的關鍵字
  const keyword = req.query.keyword

  let matchedRestaurantsPromise;

  if (keyword) {
    //sequelize官方文件有針對Op.or和Op.like說明
    matchedRestaurantsPromise = Restaurant.findAll({
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


router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  //利用req.body拿到POST方法傳過來的資料，會是一個物件，name為key、value為值。下面宣告用解構賦值
  const { name, category, location, phone, image } = req.body

  return Restaurant.create({ name, category, location, phone, image })
    .then(() => res.redirect('/restaurants'))
    .catch((err) => console.log(err))
})

router.get('/:id', (req, res) => {
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
      res.render('detail', { restaurant }) 
    })

    .catch((err) => res.status(422).json(err))
})

router.get('/:id/edit', (req, res) => {
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

router.put('/:id', (req, res) => {
  const id = req.params.id
  // 下面用解構賦值寫法
  const { name, category, location, phone, image } = req.body

  Restaurant.update({ name, category, location, phone, image }, {
    where: { id }
  })
    .then(() => res.redirect(`/restaurants/${id}`))

    .catch((err) => res.status(422).json(err))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id

  return Restaurant.destroy({ where: { id } })
    .then(() => res.redirect('/restaurants'))

    .catch((err) => res.status(422).json(err))
})

module.exports = router