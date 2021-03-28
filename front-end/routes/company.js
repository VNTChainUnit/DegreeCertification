var express = require('express');
var router = express.Router();

//身份验证
router.use('/', (req, res, next) => {
  if (req.session.username!=null && req.session.usertype==2) {
    return res.redirect('/login')
  }
  next()
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
