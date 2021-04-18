/* models/school.js */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//交易信息类
const TxIinfoSchema = new Schema({
        //证书编号
        certificatenumber: {type: String},
        //交易hash值
        transactionhash: {type: String},
    },
    {timestamps: true}
);

module.exports = mongoose.model('Txinfo',TxIinfoSchema,"txinfos");
