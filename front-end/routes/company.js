var express = require('express');
var router = express.Router();
const companyService=require('../service/companyService')
const blockchain=require('../service/blockchain/main');
const utils = require('../service/utils');
//身份验证
router.use('/', (req, res, next) => {
    req.session.username='company'
    req.session.usertype=2
  if (req.session.username!=null && req.session.usertype==2) {
    next()
  }
  else{
    res.redirect('/login')
  }
})

router.post('/checkCertificate',(req,res,next)=>{
  let data=req.body
  let checkresult=blockchain.checkCertificate(data.certificate_number,data.name,
    data.school,data.degreetype,data.graduationdate,data.major)
  if(checkresult){
    res.json(utils.restful(0,null,null))
  }
  else{
    res.json(utils.restful(-1,null,"证书不正确"))
  }
})

router.get('/', async function(req, res, next) {
  let company=await companyService.getByUsername(req.session.username)
  res.render('company/index.ejs',{name:company.name})
});

module.exports = router;
