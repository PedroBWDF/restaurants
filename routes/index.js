// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const root = require('./root')
const oauth = require('./oauth')
// 準備引入路由模組
const restaurants = require('./restaurants')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')

router.use('/', root)
router.use('/oauth', oauth)
//第一個參數以'/restaurants'作為根路徑，第二個參數用auth middleware檢查登入狀態，再來導向'/restaurants'的請求都會再分發至第三個參數'restaurants'的文件
router.use('/restaurants', authHandler, restaurants)
router.use('/users', users)

router.post('/login', (req, res) => {
  return res.send(req.body)
})


// 匯出路由器
module.exports = router