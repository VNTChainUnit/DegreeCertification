var express = require('express');
var multer  = require('multer')
var fs = require('fs');
const studentService = require('../service/studentService');
const schoolService= require('../service/schoolService');
const companyService=require('../service/companyService');
const adminService = require('../service/adminService');
var router = express.Router();
const utils=require('../service/utils');
const companyApplyService = require('../service/companyApplyService');
const certificateService=require('../service/certificateService')
/* GET home page. */

//***********文件上传配置begin
var createFolder = function(folder){
  try{
      fs.accessSync(folder); 
  }catch(e){
      fs.mkdirSync(folder);
  }  
};

var uploadFolder = './upload/';

createFolder(uploadFolder);
// 通过 filename 属性定制
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
  },
  filename: function (req, file, cb) {
      // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
      cb(null, Date.now()+"."+"jpg");  
  }
});

var upload = multer({ storage: storage });
//***********文件上传配置end
router.post('/companyapply/uploadfile', upload.single('file'), function(req, res, next){
  var file = req.file;
  let url="/uploads/"+file.filename
  res.json(utils.restful(null,{src:url},null))
});


router.get('/', function (req, res, next) {
  res.redirect("/login");
});

router.get('/login', function (req, res, next) {
  let message=""
  if(req.query.error){
    if(req.query.error==1){
      message="账户名或者密码错误！"
    }
    else if(req.query.error==2){
      message="系统错误！"
    }
  }
  res.render('login',{message:message})
})

router.get('/register', function (req, res, next) {
  res.render('register')
})

//如果有 返回id,否则返回false
async function checkAccount(username,password,usertype){
  if (usertype == 1) {
    return await studentService.login(username,password);
  }
  else if (usertype == 2) {
    return await companyService.login(username,password)
  }
  else if (usertype == 3) {
    return await schoolService.login(username,password)
  }
  else {
    return false;
  }
}

router.post('/login', async function (req, res) {
  let data = req.body;
  let usertype = parseInt(data.usertype);
  //返回bool
  if (await  checkAccount(data.username, data.password, usertype)) {
    req.session.username = data.username;
    req.session.usertype = usertype;
    if (usertype == 1) {
      res.redirect("/student/")
    }
    else if (usertype == 2) {
      res.redirect("/company/")
    }
    else if (usertype == 3) {
      res.redirect("/school/")
    }
    else {
      res.redirect('/login?error=2')
    }
  }
  else {
    res.redirect("/login?error=1")
  }
})

router.post("/register",async function(req,res,next){
  let school=await schoolService.getSchoolByName(req.body.school);
  let data=req.body
  if(school==null){res.json(utils.restful(-1,null,"学校不存在!"))}
  if(await studentService.register(data.name,data.studentnumber
    ,data.password,school._id,data.idnumber)){
    res.json(utils.restful(null,{url:"/login"},null));
  }
  else{
    res.json(utils.restful(-1,null,"创建失败,请检查信息是否正确!"));
  }
})

//登出
router.get('/logout',function(req,res,next){
  delete req.session.username;
  let oldusertype=req.session.usertype;
  delete req.session.usertype;
  //判断是否是管理员
  if(oldusertype==4){
    res.redirect('/admin/login');
  }
  else{
    res.redirect('/login');
  }
})

//修改密码
router.get('/changePassword',async (req,res,next)=>{
  if(req.session.username && req.session.usertype){
    let name=await studentService.getByUsername(req.session.username).name
  res.render('changePassword',{name:name})
  }
  else{
    res.redirect('/login')
  }
})

//修改密码post
router.post('/changePassword',async (req,res,next)=>{
  let oldpassword=req.body.old_password
  let newpassword=req.body.new_password
  //定义结果
  let result=false
  //登录required
  if(req.session.usertype && req.session.username){
    //根据usertype选择不同的角色
    if(req.session.usertype==1){
      //学生逻辑不同，需要传过去不同信息
      let student=await studentService.getByUsername(req.session.username)
      if(student){
        if(utils.checkPassword(student.password,oldpassword)){
        studentService.changePassword(student.school_id,student.studentnumber,newpassword)
        result=true
        }
        //密码不对就错误
        else result=false
      }
      else{
        //找不到也错误
        result=false
      }
    }
    else if(req.session.usertype==2){
      result=await companyService.changePassword(req.session.username,oldpassword,newpassword)
    }
    else if(req.session.usertype==3){
      result=await schoolService.changePassword(req.session.username,oldpassword,newpassword)
    }
    else if(req.session.usertype==4){
      result=await adminService.changePassword(req.session.username,oldpassword,newpassword)
    }
    else result=false
    if (result){
      res.json(utils.restful(null,null,null))
    }
    else res.json(utils.restful(-1,null,"原始密码错误！"))
  }
  else{
    res.json(utils.restful(-1,null,"您还没有登录"))
  }
})

router.post('/companyapply',(req,res,next)=>{
   let data=req.body;
   const result=companyApplyService.addCompanyApply(data.name,data.creditcode,data.email,data.password,data.fileurl)
   if(result){
      res.json(utils.restful(null,null,null))
   }
   else{
      res.json(utils.restful(-1,null,"注册失败"))
   }
})

router.get('/companyapply',(req,res,next)=>{
  res.render('companyRegister')
})


router.get('/check/:code',async (req,res,next)=>{
  try{
    let encryptcode =req.params['code']
    let certificate = await utils.getCertificateByEncryptContent(certificate);
    if(certificate){
      res.render('certificate',{certificate,certificate})
    }
    else{
      res.send("证书校验失败，证书可能已被篡改！")
    }
  }
  catch(e){
    res.send("二维码已被篡改！")
  }
})


module.exports = router;
