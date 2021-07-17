var express = require('express');
const schoolService = require('../service/schoolService');
var router = express.Router();
const utils=require('../service/utils')
const studentService= require('../service/studentService');
const student = require('../models/student');
const blockchain = require('../service/blockchain/main')
const certificateService=require('../service/certificateService')
const certificateCheckService=require('../service/certificateCheckService');
//身份验证
router.use('/', (req, res, next) => {
  if (req.session.username!=null && req.session.usertype==3) {
    next()
  }
  else{
  return res.redirect('/login')
  }
})

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let school=await schoolService.getSchoolByUsername(req.session.username)
  res.render('school/index',{school:school});
});

router.get('/studentAccount',function(req,res,next){
  res.render('school/studentAccount');
})

router.get('/uploadCertificate',async function(req,res,next){
  let school=await schoolService.getSchoolByUsername(req.session.username)
  res.render('school/uploadCertificate',{school:school});
})

router.get('/api/student',async (req,res,next)=>{
  let data=req.query
  //先拿到学校
  let school=await schoolService.getSchoolByUsername(req.session.username)
  //判断是否是条件查询
  if(data.name || data.studentnumber){
    let student = await studentService.getByNameNumber(data.name,data.studentnumber,school._id)
    res.json(utils.restful(null,student,null))
  }
  else{
    let students=await studentService.getAll(school._id)
    res.json(utils.restful(null,students,null))
  }
})

router.delete('/api/student',async (req,res,next)=>{
  let school=await schoolService.getSchoolByUsername(req.session.username)
  let students=await studentService.getByNameNumber(null,req.body.studentnumber,school._id);
  if(students){
    //先删除学校的
  schoolService.removeStudent(school._id,students[0]._id)
  //再删除学生的
  studentService.deleteOne(school._id,req.body.studentnumber)
  res.json(utils.restful(null,null,null))
  }
else{
  res.json(utils.restful(-1,null,"学生不存在"))
}
})

//重置密码
router.put('/api/student',async(req,res,next)=>{
  let school=await schoolService.getSchoolByUsername(req.session.username)
  let defaultpassword =school.code+"123456"
  studentService.changePassword(school._id,req.body.studentnumber,defaultpassword)
  res.json(utils.restful(0,null,"默认密码为"+defaultpassword+"<br>请提醒学生尽快修改密码！"))
})

//增加待审核的证书
router.post('/api/certificate',async(req,res,next)=>{
  let data=req.body
  let school=await schoolService.getSchoolByUsername(req.session.username)
  certificateCheckService.addUncheckedCertificate(school._id,school.name,data.name,data.idnumber,
    data.degreetype,data.major,data.graduationdate,data.studentnumber,data.certificatenumber)
  res.json(utils.restful(null,null,null))
})

module.exports = router;
