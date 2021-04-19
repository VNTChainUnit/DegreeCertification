const company = require('../models/company');
const CompanyApply=require('../models/companyApply')
const emailService = require('../service/email')
function addCompanyApply(name,creditcode,email,password,fileurl){
    //核验统一信用代码和姓名
    //if () return false
    //这里不做核验
    var companyApply=CompanyApply({
        name:name,
        creditcode:creditcode,
        email:email,
        password:password,
        status:0,
        fileurl:fileurl
    })
    companyApply.save()
    return true;
}

async function getUncheckedApply(){
    let res=await CompanyApply.find({status:0})
    return res;
}

//申请id和bool变量表示状态
function checkCompany(id,checktype){
    //审核通过
    if(checktype){
        CompanyApply.updateOne({_id:id},{status:1},(err,result)=>{
            if(err){
                console.log(err)
            }
            else{
                //发送邮件
                // emailService.sendEmail(result.email,"审核结果",
                // result.name+"，您好。恭喜您的注册通过审核，请您使用您的邮箱和注册时的密码进行登录。<br>信诣团队")
            }
        })
    }
    //审核不通过
    else{
        CompanyApply.updateOne({_id:id},{status:-1},(err,result)=>{
            if(err){
                console.log(err)
            }
            else{
                 //发送邮件
                //  emailService.sendEmail(result.email,"审核结果"
                //  ,result.name+"，您好。您的审核没有通过。请您检查材料是否符合条件后，再次提交审核。<br>信诣团队")
            }
        })
    }
}

async function findById(id){
    return await CompanyApply.findById(id)
}

module.exports={
    addCompanyApply:addCompanyApply,
    getUncheckedApply:getUncheckedApply,
    checkCompany:checkCompany,
    findById:findById
}