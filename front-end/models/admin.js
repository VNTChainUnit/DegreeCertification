/* models/admin.js */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//管理员账户
const AdminSchema = new Schema({
        username: {type: String},
        password: {type: String}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Admin ',AdminSchema,"admin");
