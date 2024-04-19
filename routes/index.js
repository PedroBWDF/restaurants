// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const passport = require('passport')
const LocalStrategy = require('passport-local')

const db = require('../models')
const User = db.User

//將username來源改為email
passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  return User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email: username },
    raw: true
  })
    .then((user) => {
      if (!user || user.password !== password) {
        return done(null, false, { message: 'email 或密碼錯誤' })
      }
      //第一個參數因沒有錯誤所以為null，第二個參數(user)將驗證過的user資料物件儲存在session中
      return done(null, user)
    })
    .catch((error) => {
      error.errorMessage = '登入失敗'
      done(error)
    })
}))

//第一個參數user為上方程式碼done(null, user)傳遞過來的資料
passport.serializeUser((user, done) => {
  const { id, name, email } = user
  //把用戶驗證後的id, name, email存到session
  return done(null, { id, name, email })
})

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
  console.log('session', req.session)
  return res.render('login')
})

//處理登入驗證後的路由導向
router.post('/login', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))

router.post('/login', (req, res) => {
  return res.send(req.body)
})

router.post('/logout', (req, res) => {
  return res.send('logout')
})

// 匯出路由器
module.exports = router