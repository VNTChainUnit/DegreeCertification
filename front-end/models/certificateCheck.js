/* models/certificateCheck.js */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//证书信息暂存类
const CertificateCheck = new Schema({
    school :{type:String},	// 学校
    name: {type:String},		// 学生姓名
    idnumber :{type:String},		// 身份证号
    degreetype :{type:String},		// 学位类别
    major :{type:String},		 // 专业
    graduationdate :{type:String},	 // 毕业年月
    studentnumber :{type:String},    	 // 学号
    certificatenumber :{type:String},	// 证书编号
    school_id: {type:Schema.Types.ObjectId}  //学校id
    },
    {timestamps: true}
);

module.exports = mongoose.model('CertificateCheck',CertificateCheck,"certificatechecks");
