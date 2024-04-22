// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['email', 'displayName']
}, (accessToken, refreshToken, profile, done) => {

  //下方教案再進行實作
  const email = profile.emails[0].value
  const name = profile.displayName

  return User.findOne({
    attributes: ['id', 'name', 'email'],
    where: { email },
    raw: true
  })
    .then((user) => {
      if (user) return done(null, user)

      const randomPwd = Math.random().toString(36).slice(-8)

      return bcrypt.hash(randomPwd, 10)
        .then((hash) => User.create({ name, email, password: hash }))
        .then((user) => done(null, { id: user.id, name: user.name, email: user.email }))
    })
    .catch((error) => {
      error.errorMessage = '登入失敗'
      done(error)
    })
}))

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))

//將username來源改為email
passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  return User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email: username },
    raw: true
  })
    .then((user) => {
      if (!user) {
        return done(null, false, { message: 'email 或密碼錯誤' })
      }

      // 將登入時的密碼經過加鹽 + hash再比對
      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return done(null, false, { message: 'email 或密碼錯誤' })
          }
        //第一個參數因沒有錯誤所以為null，第二個參數(user)將驗證過的user資料物件儲存在session中
        return done(null, user)
        })
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

//第一個參數user為serialize所存到session的資料
passport.deserializeUser((user, done) => {
  //passport會把指定取出的資料放在req.user供使用
  done(null, { id: user.id })
})

// 準備引入路由模組
const restaurants = require('./restaurants')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')

//第一個參數以'/restaurants'作為根路徑，第二個參數用auth middleware檢查登入狀態，再來導向'/restaurants'的請求都會再分發至第三個參數'restaurants'的文件
router.use('/restaurants', authHandler, restaurants)
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
  req.logout((error) => {
    if (error) {
      next(error)
    }

    return res.redirect('/login')
  })
})

// 匯出路由器
module.exports = router