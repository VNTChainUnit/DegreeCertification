var express = require('express');
var router = express.Router();
const companyService=require('../service/companyService')
const blockchain=require('../service/blockchain/main');
const utils = require('../service/utils');
const applicationService=require('../service/applicationService')
//身份验证
router.use('/', (req, res, next) => {
  if (req.session.username!=null && req.session.usertype==2) {
    next()
  }
  else{
    res.redirect('/login')
  }
})


router.get('/', async function(req, res, next) {
  let company=await companyService.getByUsername(req.session.username)
  res.render('company/index.ejs',{name:company.name})
});

router.get('/application',(req,res,next)=>{
  res.render('company/application.ejs')
})

router.get('/application/detail/:applicationid',(req,res,next)=>{
  res.render('company/detail.ejs')
})

router.post('/api/checkCertificate',(req,res,next)=>{
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
//get lsit
router.get('/api/application',async(req,res,next)=>{
  let company=await companyService.getByUsername(req.session.username)
  let ret= await applicationService.getApplication(company._id);
  res.json(utils.restful(0,ret,null));
})

//get callrecords
router.get('api/callrecord',(req,res,next)=>{
  let applicaitonid=req.query.applicationid
  if(applicaitonid) res.json(utils.restful(0,applicationService.getRecord(applicaitonid),null));
  else res.json(utils.restful(-1,null,"applicationid missing"));
})

//create applicaiotn
router.post('/api/application',async(req,res,next)=>{
  let company=await companyService.getByUsername(req.session.username)
  let data=req.body;
  if(data.name!=null&&data.comment!=null){
    applicationService.createApplication(company._id,body.name,body.comment);
    res.json(utils.restful(-0,null,null));
  }
  else res.json(utils.restful(-1,null,"parameters missing"));
})

//switch the status
router.post('/api/application/status',(req,res,next)=>{
    if(req.body.status==0){
      applicationService.stopApplication(req.body.applicaitonid);
    }
    else {
      applicationService.openApplication(req.body.applicaitonid);
    }
    res.json(utils.restful(null,null,null))
})

module.exports = router;
