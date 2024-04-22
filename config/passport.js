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

module.exports = passport