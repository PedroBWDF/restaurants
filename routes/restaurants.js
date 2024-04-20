const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

const { Op } = require('sequelize');

router.get('/', (req, res, next) => {
    const keyword = req.query.keyword
    const userId = req.user.id
    const sort = req.query.sort
    let sort1 = 0
    let sort2 = 0
    let sort3 = 0
    let sort4 = 0

    // 若被選中，賦值1 (index.hbs有定義是否被選中)
    if (sort === 'name_asc') {
      sort1 = 1
    } else if (sort === 'name_desc') {
      sort2 = 1
    } else if (sort === 'category') {
      sort3 = 1
    } else if (sort === 'location') {
      sort4 = 1
    }

    // sequelize官方文件order定義
    const sortOptions = {
      name_asc: [['name', 'ASC']],
      name_desc: [['name', 'DESC']],
      category: [['category', 'ASC']],
      location: [['location', 'ASC']]
    }

    let restaurantsPromise

    // 如果有搜尋關鍵字
    if (keyword) {
      restaurantsPromise = Restaurant.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { category: { [Op.like]: `%${keyword}%` } }
          ]
        },
        raw: true
      })
    } else {
      restaurantsPromise = Restaurant.findAll({
        where : { userId },
        //sequelize提供的排序方法
        order: sortOptions[sort],
        raw: true
      })
    }

    restaurantsPromise
    .then((restaurants) => {
      res.render('index', {
        restaurants, keyword,
        sort1,
        sort2,
        sort3,
        sort4
      })
    })
      .catch((error) => {
        error.errorMessage = '資料取得失敗:('
        next(error)
      })
})


router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res, next) => {
  //利用req.body拿到POST方法傳過來的資料，會是一個物件，name為key、value為值。下面宣告用解構賦值
  const { name, category, location, phone, image } = req.body
  const userId = req.user.id

  return Restaurant.create({ name, category, location, phone, image, userId })
    .then(() => {
      req.flash('success', '成功新增餐廳了!')
      res.redirect('/restaurants')
    })
    .catch((err) => {
      console.log(err)
      error.errorMessage = '新增失敗:('
      next(error)
    })
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'category', 'location', 'phone', 'image', 'userId'],
    raw: true
  })
    //findByPk查詢到的資料會被作為參數傳遞到.then的callback function
    .then((restaurant) => {
      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      if (restaurant.userId !== userId) {
        req.flash('error', '你沒有存取此資料的權限')
        return res.redirect('/restaurants')
      }
      //restaurant為渲染模板時用的名稱
      res.render('detail', { restaurant })
    })

    .catch((error) =>{
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'category', 'location', 'phone', 'image', 'userId'],
    raw: true
  })
    //findByPk查詢到的資料會被作為參數傳遞到.then的callback function
    .then((restaurant) => {
      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      if (restaurant.userId !== userId) {
        req.flash('error', '你沒有存取此資料的權限')
        return res.redirect('/restaurants')
      }
      //restaurant為渲染模板時用的名稱
      res.render('edit', { restaurant })
    })

    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

router.put('/:id', (req, res, next) => {
  const id = req.params.id
  // 下面用解構賦值寫法
  const { name, category, location, phone, image } = req.body
  const userId = req.user.id

  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'category', 'location', 'phone', 'image', 'userId'],
  })

    .then((restaurant) => {
      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      if (restaurant.id !== userId) {
        req.flash('error', '你沒有存取此資料的權限')
        return res.redirect('/restaurants')
      }
      
      return restaurant.update({ name, category, location, phone, image })
        .then(() => {
          req.flash('success', '成功更新餐廳資料!')
          res.redirect(`/restaurants/${id}`)
        })
    })

    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'category', 'location', 'phone', 'image', 'userId'],
  })

    .then((restaurant) => {
      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      if (restaurant.id !== userId) {
        req.flash('error', '你沒有存取此資料的權限')
        return res.redirect('/restaurants')
      }

      return restaurant.destroy()
        .then(() => {
          req.flash('success', '餐廳資料已被刪除!')
          res.redirect('/restaurants')
        })
    })

    .catch((error) => {
      error.errorMessage = '刪除失敗:('
      next(error)
    })
})

module.exports = router