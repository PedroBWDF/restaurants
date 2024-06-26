const express = require('express')
const { engine } = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
console.log('env', process.env.NODE_ENV)

const port = 3000
const methodOverride = require('method-override')
//引用passport file
const passport = require('./config/passport')
// 引用路由器
const router = require('./routes')
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(messageHandler)

//根據express文件，載入餐廳json靜態資料
app.use(express.static('public'))

// 將 request 導入路由器
app.use(router)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})