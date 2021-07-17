var express = require('express');
var router = express.Router();
const qr=require('qr-image');
const utils=require('../service/utils')
const studentService=require('../service/studentService')
const blockchain=require('../service/blockchain/main')
const certificateService=require('../service/certificateService')
const certificateCheckService=require('../service/certificateCheckService');

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

router.get('/qrcode', async(req, res, next)=> {
  let student=await studentService.getByUsername(req.session.username)
  let text= utils.encryptCertificate(student.certificate_number,req.session.idnumber)
  try {
    var img = qr.image(text,{size :10});
    res.writeHead(200, {'Content-Type': 'image/png'});
    img.pipe(res);
  } catch (e) {
    res.writeHead(414, {'Content-Type': 'text/html'});
    res.end('<h1>Error</h1>');
  }
})

//审核证书通过
router.post('/api/checkCertificate',async(req,res,next)=>{
  let data=req.body
  let res=certificateCheckService.checkCertificate(data.check_id);
  res.json(utils.restful(null,res,null));
})

//获取待核验证书
router.get('/api/uncheckedCertificate',async(req,res,next)=>{
  let data=req.query;
  let stu=await studentService.getByUsername(req.session.username);
  let res=await certificateCheckService.getStudentUncheckCertificate(stu._id,stu.school_id)
  res.json(utils.restful(null,res,null));
})

module.exports = router;
