const  utils=require('./utils') 
const Wxaccount=require('../models/wxaccount')

function bindStudent(openid,moduleid){
    var account=new Wxaccount({
        user_id:moduleid,
        usertype:1,
        openid:openid
    });
    account.save();
}

async function findStudentByOpenid(openid){
    var student=await Wxaccount.findOne({openid:openid}); 
    if(student!=null)return student._id;
    else return null;
}



module.exports={
    bindStudent:bindStudent,
    findStudentByOpenid:this.findStudentByOpenid
}