var express = require('express');
var router = express.Router();
const companyService=require('../service/companyService')
const blockchain=require('../service/blockchain/main');
const utils = require('../service/utils');
const applicationService=require('../service/applicationService')
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
  if (req.session.username!=null && req.session.usertype==2) {
    next()
  }
  else{
    res.redirect('/login')
  }
})


router.get('/', async function(req, res, next) {
  let company=await companyService.getByUsername(req.session.username)
  res.render('company/index.ejs',{name:company.name})
});

router.get('/application',async (req,res,next)=>{
  let company=await companyService.getByUsername(req.session.username)
  res.render('company/application.ejs',{name:company.name})
})

router.get('/addApplication',async (req,res,next)=>{
  res.render('company/addApplication.ejs')
})

router.get('/application/detail/:applicationid',(req,res,next)=>{
  res.render('company/detail.ejs')
})

router.post('/api/checkCertificate',(req,res,next)=>{
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

//get lsit
router.get('/api/application',async(req,res,next)=>{
  let company=await companyService.getByUsername(req.session.username)
  let ret= await applicationService.getApplication(company._id);
  res.json(utils.restful(0,ret,null));
})

//get callrecords
router.get('/api/callrecord',async (req,res,next)=>{
  let applicaitonid=req.query.applicationid
  let data=await applicationService.get7daysRecord(applicaitonid)
  if(applicaitonid) res.json(utils.restful(0,data ,null));
  else res.json(utils.restful(-1,null,"applicationid missing"));
})

//create applicaiotn
router.post('/api/application',async(req,res,next)=>{
  let company=await companyService.getByUsername(req.session.username)
  let data=req.body;
  if(data.name!=null&&data.comment!=null){
    applicationService.createApplication(company._id,data.name,data.comment);
    res.json(utils.restful(0,null,null));
  }
  else res.json(utils.restful(-1,null,"parameters missing"));
})

//switch the status
router.post('/api/application/status',(req,res,next)=>{
    if(req.body.status==0){
      applicationService.stopApplication(req.body.applicationid);
    }
    else {
      applicationService.openApplication(req.body.applicationid);
    }
    res.json(utils.restful(null,null,null))
})

/**
 * 上传批量核验excel，返回核验结果
 */
router.post('/api/uploadCheckMultipleCertificate',upload.single('file'),async function(req,res,next){
  var file = req.file;
  let filePath=path.join(__dirname,'../upload/excel/'+file.filename)
  let sheetList = xlsx.parse(filePath);
  //第8行开始取数据，证书编号、姓名、学校名称、专业名称、学位类别、毕业日期
  if(sheetList[1]==null){
    //TODO 返回错误
  }
  let head = ['证书编号','姓名','学校名称','专业名称','学位类别','毕业日期','核验结果'];
  let out_data = [];
  out_data.push(head);
  let excelData = xlsx.parse(filePath);
  const data=excelData[0].data;
  //从第8行开始
  data.forEach((item, index) => {
      if (index <= 6 || item == null || item.length==0 ) {
        // 去除前7行
        return;
      } else {
        let result = blockchain.checkCertificate(item[0],item[1],item[2],item[4],item[5],item[3]);
        if(result){
          item.push('核验通过');
        }
        else{
          item.push('核验不通过');
        }
        out_data.push(item);
      }
  });
  let out_fileDir = path.join(__dirname,'../public/downloads/check/')
  let out_fileName = Date.now()+'.xlsx';
  let out_url = '/static/downloads/check/'+out_fileName;
  let result = utils.excelExport(out_data,out_fileDir+out_fileName);
  if(result){
    res.json(utils.restful(null,{
      'url':out_url
    },null))
  }
  else{
    res.json(utils.restful(-1,null,"System error!"))
  }
  
})

module.exports = router;
