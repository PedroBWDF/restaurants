// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 準備引入路由模組
const restaurants = require('./restaurants')
const users = require('./users')

//第一個參數以'/restaurants'作為根路徑，所有導向'/restaurants'的請求都會再分發至第二個參數'restaurants'的文件
router.use('/restaurants', restaurants)
router.use('/users', users)

router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

router.get('/register', (req, res) => {
  return res.render('register')
})

router.get('/login', (req, res) => {
  return res.render('login')
})

router.post('/login', (req, res) => {
  return res.send(req.body)
})

router.post('/logout', (req, res) => {
  return res.send('logout')
})

// 匯出路由器
module.exports = router