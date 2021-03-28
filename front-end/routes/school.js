var express = require('express');
var router = express.Router();

//身份验证
router.use('/', (req, res, next) => {
  if (req.session.username!=null && req.session.usertype==3) {
    return res.redirect('/login')
  }
  next()
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('school/index');
});

router.get('/studentAccount',function(req,res,next){
  res.render('school/studentAccount');
})

router.get('/uploadCertificate',function(req,res,next){
  res.render('school/uploadCertificate');
})

module.exports = router;
