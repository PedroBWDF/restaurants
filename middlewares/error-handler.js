module.exports = (error, req, res, next) => {
  console.error(error)
  //把錯誤訊息存入flash，以便在下次request(也就是redirect)取用
  req.flash('error', error.errorMessage || '處理失敗:(')
  res.redirect('back')

  // 繼續把錯誤傳給express預設的error middleware (?)
  next(error)
}