/* models/encryptContent.js */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//加密信息映射
const EncryptContentSchema = new Schema({
        content: {type: String},
        filename:{type:String}
    },
    {timestamps: true}
);

module.exports = mongoose.model('EncryptContent ',EncryptContentSchema,"encryptcontents");
