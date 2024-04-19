module.exports = (req, res, next) => {
  //從路由邏輯中取出訊息，儲存在res.locals，再以success_msg和error_msg傳給message.hbs
  res.locals.success_msg = req.flash('success')
  res.locals.error_msg = req.flash('error')

  next()
}