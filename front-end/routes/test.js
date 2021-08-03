var express = require('express');
var router = express.Router();
const blockchain=require('../service/blockchain/main')
const utils=require('../service/utils')
const wxService =require('../service/wxService')
router.get("/getcertificate",async (req,res,next)=>{
  let ret = await blockchain.getCertificate("zsbh202","202")
  res.send(ret);
  res.end();
})

router.get("/addcertificate",async (req,res,next)=>{
  blockchain.addCertificate('测试大学',"xm","199","本科","major","2021-07","xh199","zsbh199")
})

router.get("/addWxQrCode",async(req,res,next)=>{
  let certificatenumber="103384202106152390"
  let idnumber="110425200002282330"
  let encryptContent= utils.encryptCertificate(certificatenumber,idnumber)
  wxService.saveWxQrcode(encryptContent);
})

module.exports=router