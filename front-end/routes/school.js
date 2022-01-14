var express = require('express');
const schoolService = require('../service/schoolService');
var router = express.Router();
const utils=require('../service/utils')
const studentService= require('../service/studentService');
const student = require('../models/student');
const blockchain = require('../service/blockchain/main')
const certificateService=require('../service/certificateService')
const certificateCheckService=require('../service/certificateCheckService');
var multer  = require('multer')
var fs = require('fs');
const xlsx = require('node-xlsx')
var path=require('path');

//***********文件上传配置begin
var createFolder = function(folder){
  try{
      fs.accessSync(folder); 
  }catch(e){
      fs.mkdirSync(folder);
  }  
};

var uploadFolder = './upload/excel';

createFolder(uploadFolder);
// 通过 filename 属性定制
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
  },
  filename: function (req, file, cb) {
      // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
      cb(null, Date.now()+"."+"xls");  
  }
});

var upload = multer({ storage: storage });
//***********文件上传配置end

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

router.get('/multiUploadCertificate',async function(req,res,next){
  let school=await schoolService.getSchoolByUsername(req.session.username)
  res.render('school/schoolMultiUpload',{school:school});
})

router.get('/apiIndex',async function(req,res,next){
  let school=await schoolService.getSchoolByUsername(req.session.username)
  res.render('school/apiIndex',{school:school});
})

//学校管理未核验证书
router.get('/uncheckedCertificate',async function(req,res,next){
  let school=await schoolService.getSchoolByUsername(req.session.username)
  res.render('school/uncheckedCertificate',{school:school});
})

//学校修改证书
router.get('/updateUncheckedCertificate',async function(req,res,next){
  let school=await schoolService.getSchoolByUsername(req.session.username)
  let certificate = await certificateCheckService.getById(req.query.checkid);
  if(certificate){
    res.render('school/updateUncheckedCertificate',{school:school,certificate:certificate});
  }
  else{
    res.redirect('/school/uncheckedCertificate')
  }
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
  certificateCheckService.addUncheckedCertificate(school._id,data.name,data.idnumber,
    data.degreetype,data.major,data.graduationdate,data.studentnumber,data.certificatenumber)
  res.json(utils.restful(null,null,null))
})

router.post('/api/uploadManyCertificate',upload.single('file'),async function(req,res,next){
  var file = req.file;
  let filePath=path.join(__dirname,'../upload/excel/'+file.filename)
  let sheetList = xlsx.parse(filePath);
  //第九行开始取数据，证书编号、姓名、学号、身份证号、专业名称、学位类别、毕业日期
  if(sheetList[1]==null){
    //TODO 返回错误
  }
  let school=await schoolService.getSchoolByUsername(req.session.username)
  let certificateChecks = utils.mapUncheckedCert(sheetList,school);
  certificateCheckService.addManyUncheckedCertificates(certificateChecks);
  res.json(utils.restful(null,null,"成功上传证书"+certificateChecks.length+"个。"))
})

//搜索查询
router.get('/api/uncheckedCertificate',async (req,res,next)=>{
  let data=req.query
  //先拿到学校
  let school=await schoolService.getSchoolByUsername(req.session.username)
  //判断是否是条件查询
  let ret;
  if(data.name || data.studentnumber){
    ret = await certificateCheckService.getStudentUncheckCertificateFilter(data.studentnumber,data.name,school._id)
  }
  else{
    ret=await certificateCheckService.listSchoolUncheckedCertificates(school._id);
  }
  res.json(utils.restful(null,ret,null))
})

//删除未待核验证书
router.delete('/api/uncheckedCertificate',(req,res,next)=>{
  let id=req.body.checkid;
  certificateCheckService.deleteUncheckedCertificate(id);
  res.json(utils.restful(null,null,null));
})

//修改待核验证书
router.put('/api/uncheckedCertificate',(req,res,next)=>{
  let data=req.body
  certificateCheckService.editStudentUncheckCertificate(data._id,data.name,data.idnumber,
    data.degreetype,data.major,data.graduationdate,data.studentnumber,data.certificatenumber)
  res.json(utils.restful(null,null,null))
})


module.exports = router;
