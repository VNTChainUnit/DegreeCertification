var express = require('express');
const studentService = require('../service/studentService');
const schoolService= require('../service/schoolService');
const companyService=require('../service/companyService');
var router = express.Router();
const restful=require('../service/utils').restful;
/* GET home page. */

router.get('/', function (req, res, next) {
  res.redirect("/login");
});

router.get('/login', function (req, res, next) {
  res.render('login')
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
      res.redirect('/login')
    }
  }
  else {
    res.redirect("/login")
  }
})

router.post("/register",async function(req,res,next){
  let school=await schoolService.getSchoolByName(req.body.school);
  let data=req.body
  if(school==null){res.json(restful(-1,null,"学校不存在!"))}
  if(await studentService.register(data.name,data.studentnumber
    ,data.password,school._id,data.idnumber)){
    res.json(restful(null,{url:"/login"},null));
  }
  else{
    res.json(restful(-1,null,"创建失败,请检查信息是否正确!"));
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


module.exports = router;
