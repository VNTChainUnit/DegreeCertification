var express = require('express');
var router = express.Router();
const utils=require('../service/utils')
const studentService=require('../service/studentService')
const blockchain=require('../service/blockchain/main')
const certificateService=require('../service/certificateService')
//身份验证
router.use('/', (req, res, next) => {
  if (req.session.username!=null && req.session.usertype==1) {
    next()
  }
  else{
    return res.redirect('/login')
  }
  
})

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let student=await studentService.getByUsername(req.session.username)
  res.render('student/index',{name:student.name});
});

router.get('/certificate',async(req,res,next)=>{
  if(req.session.idnumber){
    let student=await studentService.getByUsername(req.session.username)
    let certificate=await certificateService.getCertificate(student.certificate_number,req.session.idnumber)
    if(certificate){
    res.render('student/certificate',{certificate:certificate,name:student.name})
    }
  }
  else{
    res.redirect('/student/')
  }
})

router.post('/getCertificate',async (req,res,next)=>{
  let student=await studentService.getByUsername(req.session.username)
  let certificate =await  certificateService.getCertificate(student.certificate_number,req.body.idnumber)
  if(certificate){
    req.session.idnumber=req.body.idnumber
    res.json(utils.restful(null,certificate,null))
  }
  else{
    res.json(utils.restful(-1,null,"请检查证件号是否有误！"))
  }
})

module.exports = router;
