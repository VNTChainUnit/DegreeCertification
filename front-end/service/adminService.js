const Admin = require('../models/admin')
const utils = require('./utils')

//登录
async function login(username, password) {
    let admin=await Admin.findOne({ username: username })
    if(admin==null)return false;
    if (utils.checkPassword(admin.password, password)) {
        return true;
    }
    else return false;
}

async function changePassword(username,oldpassword,newpassword){
    let admin = await Admin.findOne({username:username})
    //先找到账户
    if(admin){
        //确认密码正确
        if(utils.checkPassword(admin.password,oldpassword)){
            admin.password=utils.generateSafePassword(newpassword)
            admin.save()
            return true
        }
    }
    //否则直接修改失败
    return false
}

module.exports = {
    login: login,
    changePassword:changePassword
}