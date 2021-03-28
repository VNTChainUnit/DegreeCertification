const Admin = require('../models/admin')
const utils = require('./utils')

//登录
async function login(username, password) {
    admin=await Admin.findOne({ username: username })
    if (utils.checkPassword(admin.password, password)) {
        return true;
    }
    else return false;
}

module.exports = {
    login: login
}