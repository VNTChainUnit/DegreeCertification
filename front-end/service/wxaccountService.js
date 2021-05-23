const  utils=require('./utils') 
const Wxaccount=require('../models/wxaccount')
const studentService=require('./studentService');
function bindStudent(openid,moduleid){
    Wxaccount.findOne({openid:openid},(err,doc)=>{
        if(err){
            return ;
        }
        else if(doc==null){
            var account=new Wxaccount({
                user_id:moduleid,
                usertype:1,
                openid:openid
            });
            account.save();
        }
    })
}

async function findStudentByOpenid(openid){
    var account=await Wxaccount.findOne({openid:openid}); 
    return await studentService.getById(account.user_id);
}



module.exports={
    bindStudent:bindStudent,
    findStudentByOpenid:findStudentByOpenid
}