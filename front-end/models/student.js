/* models/student.js */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//学生账户类
const StudentSchema = new Schema({
        //学生姓名
        name: {type: String},
        //学号
        studentnumber: {type: String},
        username: {type: String},
        password: {type: String},
        //学校id
        school_id: {type:Schema.Types.ObjectId},
        //证书编号
        certificate_number:{type:String}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Student',StudentSchema);
