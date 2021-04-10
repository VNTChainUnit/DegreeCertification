const company = require('../models/company')
const CompanyApply=require('../models/companyApply')

function addCompanyApply(name,creditcode,email,password){
    //核验统一信用代码和姓名
    //if () return false
    //这里不做核验
    var companyApply=CompanyApply({
        name:name,
        creditcode:creditcode,
        email:email,
        password:password,
        status:0
    })
    companyApply.save()
    return true;
}
module.exports={
    addCompanyApply:addCompanyApply,
}