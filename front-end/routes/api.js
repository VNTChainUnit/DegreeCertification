var express = require('express');
var router = express.Router();
const Request=require("request-promise")
const studentService=require("../service/studentService")
const utils=require("../service/utils")
const privateinfo=require("../private")
const wxaccountService=require("../service/wxaccountService")

router.get('/student/login/:code',async (req,res,next)=>{
    var url='https://api.weixin.qq.com/sns/jscode2session?grant_type=authorization_code&appid=';
    url=url +privateinfo.miniprogram_appid+'&secret='+privateinfo.miniprogram_secret;
    url+="&js_code="+req.params.code;
    let options = {
        method: 'GET',
        uri: url,
      };
    var wxret=await Request(options);
    if(wxret.errcode!=0){
        res.json(utils.restful(-5,null,"系统繁忙"))
        return;
    }
    var student=wxaccountService.findStudentByOpenid(wxret.openid);
    if(student==null){
        res.json(utils.restful(-1,null,"请绑定身份信息！"))
    }
    else res.json(utils.restful(-1,{studentid:student._id},null))
})

router.post('/student/bind',async(req,res,next)=>{
    var data=req.body;
    if(await studentService.login(data.username,data.password)){
        var student=await studentService.getByUsername(username);
        wxaccountService.bindStudent(data.openid,student.id);
    }
    else  {
        res.json(utils.restful(-1,null,"账号或密码错误！"))
    }
})

