const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

router.post('/', (req, res) => {
  // return res.send(req.body)
  const { name, email, password, confirmPassword } = req.body

  if (!email || !password) {
    req.flash('error', 'email與密碼為必填欄位')
    return res.redirect('back')
  }

  if (password !== confirmPassword) {
    req.flash('error', '驗證密碼與密碼不符')
    return res.redirect('back')
  }

  return User.count({ where: { email }})
  .then((emailCount) => {
    if(emailCount > 0) {
      req.flash('error', '此email已註冊')
      return
    }
  
    return bcrypt.hash(password, 10)
      //讓user註冊時的密碼經過加鹽+hash儲存到DB
      .then((hash) => User.create({ email, name, password: hash }))
  })

  .then((user) => {
    if (!user) {
      return res.redirect('back')
    }

    req.flash('success', '註冊成功')
    return res.redirect('/login')
  })
  .catch((error) => {
    error.errorMessage = '註冊失敗'
    next(error)
  })
})

module.exports = router