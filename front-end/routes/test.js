var express = require('express');
var router = express.Router();
const wxService= require('../service/wxService')
const utils=require('../service/utils')
const  Student=require("../models/student")

let studentService={}
studentService.getByUsername=async function(username){
    return await Student.findOne({username:username})
}

router.get("/wxQrcode",async (req,res,next)=>{
    let student=await studentService.getByUsername("csu_xh202")
  let origincontent= utils.encryptCertificate(student.certificate_number,"202")
  let buffer=await wxService.getWxQRCode(origincontent)
  if(buffer){
    res.writeHead(200, {'Content-Type': 'image/png'});
    res.write( buffer );
    res.end();
  }
  else{
    res.writeHead(414, {'Content-Type': 'text/html'});
    res.end('<h1>Error</h1>');
  }
})

module.exports=router