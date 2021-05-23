/* models/application.js */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//公司应用
const ApplicationSchema = new Schema({
        name: {type: String},
        secret: {type: String},
        comment:{type:String},
        company_id:{type:Schema.Types.ObjectId},
        remainder:{type:Number},
        status:{type:Number}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Application ',ApplicationSchema,"applications");
