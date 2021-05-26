var express = require('express');
var router = express.Router();
const Request=require("request-promise")
const studentService=require("../service/studentService")
const utils=require("../service/utils")
const privateinfo=require("../private")
const wxaccountService=require("../service/wxaccountService")
const certificateService=require("../service/certificateService")
const blockchain=require('../service/blockchain/main');
const  applicationService=require('../service/applicationService')

router.get('/student/login/:code',async (req,res,next)=>{
    var url='https://api.weixin.qq.com/sns/jscode2session?grant_type=authorization_code&appid=';
    url=url +privateinfo.miniprogram_appid+'&secret='+privateinfo.miniprogram_secret;
    url+="&js_code="+req.params.code;
    let options = {
        method: 'GET',
        uri: url,
      };
    var wxret=JSON.parse(await Request(options));
    if(wxret.errcode&&wxret.errcode!=0){
        res.json(utils.restful(-5,null,"系统繁忙"))
        return;
    }
    var student=await wxaccountService.findStudentByOpenid(wxret.openid);
    if(student==null){
        res.json(utils.restful(-1,{openid:wxret.openid},"请绑定身份信息！"))
    }
    else res.json(utils.restful(0,{studentid:student._id},null))
})

router.post('/student/bind',async(req,res,next)=>{
    var data=req.body;
    if(await studentService.login(data.username,data.password)){
        var student=await studentService.getByUsername(data.username);
        wxaccountService.bindStudent(data.openid,student.id);
        res.json(utils.restful(0,{studentid:student._id},null));
    }
    else  {
        res.json(utils.restful(-1,null,"账号或密码错误！"))
    }
})

router.post('/student/getCertificate',async(req,res,next)=>{
    let student=await studentService.getById(req.body.studentid);
    let certificate=await certificateService.getCertificate(student.certificate_number,req.body.idnumber)
    if(certificate){
        res.json(utils.restful(0,certificate,null))
    }
  else{
    res.json(utils.restful(-1,null,"证书不存在"));
  }
})

router.post('/check/',async (req,res,next)=>{
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

router.post('/auth/login',async (req,res,next)=>{
  var data=req.body;
  const session = await applicationService.loginApplication(data.applicationid,data.secret)
  if(session==null){
    res.json(utils.restful(30001,null,"Login failed"))
  }
  else {
    res.json(utils.restful(0,{session:session},"Succeed!"))
  }
})

router.post('/auth/check',async (req,res,next)=>{
  var data=req.body;
  //check session and get application
  const applicationid=await applicationService.getApplicationId(data.session);
  if(applicationid!=null){
    //check whether there is reminder times left
    if(await applicationService.callAPI(applicationid,utils.getClientIP(req))){
      //get the result
        let checkresult=blockchain.checkCertificate(data.certificate_number,data.name,
          data.school,data.degreetype,data.graduationdate,data.major)
        if(checkresult){
          res.json(utils.restful(0,{result:1},"Verification passed,certificate is true"))
        }
        else{
          res.json(utils.restful(0,{result:0},"Verification failed,certificate is false"))
        }
    }
    else {
        //no reminder times
        res.json(utils.restful(50001,null,"Your account has no times left"))
    }
  }
  else{
      res.json(utils.restful(40001,null,"Auth failed,please login again."))
  }
})

module.exports = router;