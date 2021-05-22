var express = require('express');
var router = express.Router();
const utils=require('../service/utils');
const adminService= require('../service/adminService')
const schoolService=require('../service/schoolService');
const companyService=require('../service/companyService');
const companyApplyService=require('../service/companyApplyService')
//身份验证
router.use(function (req, res, next) {
  if (req.session.username!=null && req.session.usertype==4) {
    next()
  } else {
    //排除登录
    //排除参数
    let parampos=req.originalUrl.indexOf('?')
    let originalUrl=parampos==-1?req.originalUrl:req.originalUrl.substring(0,parampos)
    if (originalUrl === '/admin/login') {
      next()
    } else {
      res.redirect('/admin/login')
    }
  }
})

router.get('/login',(req,res,next)=>{
  let message=""
  if(req.query.error){
    if(req.query.error==1){
      message="账户名或者密码错误！"
    }
    else if(req.query.error==2){
      message="系统错误！"
    }
  }
  res.render('admin/login',{message:message})
})

//登录
router.post('/login',async (req,res,next)=>{
  if(await adminService.login(req.body.username,req.body.password)){
    req.session.username=req.body.username;
    req.session.usertype=4;
    res.redirect('/admin/')
  }
  else res.redirect('/admin/login');
})

/* GET users listing. */
router.get('/', function (req, res, next) {

  res.render('admin/index', { title: 'Express' });
});

router.get('/company',function(req,res,next){
  res.render('admin/company');
})

router.get('/school',function(req,res,next){
  res.render('admin/school');
})

router.get('/updateCompany',async function(req,res,next){
 let company = await companyService.getByName(req.query.name)
  res.render('admin/updateCompany',{company:company});
})

router.get('/addCompany',(req,res,next)=>{
  res.render('admin/addCompany');
})

router.get('/addSchool',(req,res)=>{
  res.render('admin/addSchool');
})

router.get('/updateSchool',async function(req,res,next){
  let name=req.query.name
  let school=await schoolService.getSchoolByName(name); 
  res.render('admin/updateSchool',{school:school});
})

router.get('/companyApply',async function(req,res,next){
  res.render('admin/companyApply')
})

//获取未审核列表
router.get('/api/companyApply',async (req,res,next)=>{
  let data=await companyApplyService.getUncheckedApply()
  res.json(utils.restful(null,data,null))
})

router.post('/api/checkCompany',async(req,res,next)=>{
  let id=req.body._id
  if(req.body.checkcode=='1'){
    //审核记录修改
    await companyApplyService.checkCompany(id,true)
    //公司注册
    let apply=await companyApplyService.findById(id)
    //邮箱为账户
    companyService.createOne(apply.name,apply.email,apply.password)
  }
else if(req.body.checkcode=='0'){
    companyApplyService.checkCompany(id,false)
  }
  else{
    res.json(utils.restful(-1,null,"数据有误"))
    return ;
  }
  res.json(utils.restful(null,null,null))
})

router.get('/api/school',async (req,res,next)=>{
  //查询指定学校
  if(req.query.name || req.query.code){
      let data=await schoolService.getSchoolByNameCode(req.query.name,req.query.code)
      res.json( utils.restful(null,[data],null))
  }
  else{
    //查询所有
    let data=await schoolService.getAllSchool()
    res.json( utils.restful(null,data,null))
  }
  
})

router.post('/api/school',async (req,res,next)=>{
  let data=req.body
  //查找有没有这个学校
  let nowschool=await schoolService.getSchoolByName(data.name)
  if(nowschool!=null){
    res.json(utils.restful(-1,null,"该学校已存在！"))
  }
  else{
    //否则创建学校 
    schoolService.createSchool(data.name,data.code,data.username,data.password)
    res.json(utils.restful(null,null,null));
  }
})

router.put('/api/school',async (req,res,next)=>{
  let data=req.body
  let school=await schoolService.getSchoolById(data._id)
  //update
  school.name=data.name
  school.code=data.code
  school.username=data.username
  //save
  school.save()
  res.json(utils.restful(null,null,null))
})

router.delete('/api/school',(req,res,next)=>{
  schoolService.deleteSchool(req.body.name);
  res.json(utils.restful(null,null,null))
})

router.get('/api/company',async(req,res,next)=>{
  if(req.query.name){
    res.json(utils.restful(null,[await companyService.getByName(req.query.name)]))
  }
  else{
    res.json(utils.restful(null,await companyService.getAll()))
  }
})

router.post('/api/company',async(req,res,next)=>{
  data=req.body
  if(await companyService.getByName(data.name)!=null){
    res.json(utils.restful(-1,null,"公司已存在！"))
  }
  else{
    companyService.createOne(data.name,data.username,data.password)
    res.json(utils.restful(null,null,null))
  }
})

router.put('/api/company',async (req,res,next)=>{
  data=req.body
  let company=await companyService.getById(data._id)
  company.name=data.name
  company.username=data.username
  company.save()
  res.json(utils.restful(null,null,null))
})

router.delete('/api/company',(req,res,next)=>{
  companyService.deleteByName(req.body.name)
  res.json(utils.restful(null,null,null))
})



module.exports = router;
