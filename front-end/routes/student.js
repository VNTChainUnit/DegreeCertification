var express = require('express');
var router = express.Router();
const utils=require('../service/utils')
const studentService=require('../service/studentService')
const blockchain=require('../service/blockchain/main')
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

router.post('/getCertificate',async (req,res,next)=>{
  let student=await studentService.getByUsername(req.session.username)
  let certificateres = blockchain.getCertificate(student.certificate_number,req.body.idnumber)
  //如果返回空字符串则没有
  if(certificateres==""){
    res.json(utils.restful(-1,null,"证件号码有误！"))
  }
  else{
    let dataarr=certificateres.split("|")
    //对每个自端解密
    let datadict={
      "school":utils.aesDecrypt(dataarr[0]),
      "name":utils.aesDecrypt(dataarr[1]),
      "idnumber":utils.aesDecrypt(dataarr[2]),
      "degreetype":utils.aesDecrypt(dataarr[3]),
      "major":utils.aesDecrypt(dataarr[4]),
      "graduationdate":utils.aesDecrypt(dataarr[5]),
      "studentnumber":utils.aesDecrypt(dataarr[6]),
      "certificatenumber":utils.aesDecrypt(dataarr[7])
    }
    res.json(utils.restful(null,datadict,null))
  }
})

module.exports = router;
