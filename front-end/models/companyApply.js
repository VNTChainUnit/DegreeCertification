/* models/admin.js */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//管理员账户
const CompanyApplySchema = new Schema({
        //公司称呼
        name: {type: String},
        //社会统一整信代码
        creditcode:{type:String},
        //注册邮箱，将来当作登录用户名
        email:{type:String},
        password: {type: String},
        //申请状态，0未审核，<0审核不通过，1审核通过
        status:{type:Number}
    },
    {timestamps: true}
);

module.exports = mongoose.model('companyApply ',CompanyApplySchema,"companyapplies");
