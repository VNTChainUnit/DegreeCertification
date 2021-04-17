/* models/company.js */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//公司账户模型
const CompanySchema = new Schema({
    //公司名称
        name: {type: String},
        username: {type: String},
        password: {type: String}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Company',CompanySchema,"companies");
