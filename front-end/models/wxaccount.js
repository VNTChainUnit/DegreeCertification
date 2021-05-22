/* models/school.js */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//微信账号类
const WxaccountSchema = new Schema({
        openid:{type:String},
        user_id: {type:Schema.Types.ObjectId},
        usertype:{type:Number}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Wxacount',WxaccountSchema,"wxaccounts");
