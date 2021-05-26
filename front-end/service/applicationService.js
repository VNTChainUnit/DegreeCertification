const  utils=require('./utils') 
const Application=require('../models/application')
const CallRecord=require('../models/callRecord')
const random=require("string-random");
const Redis=require('./redisService')

async function createSecret(){
    let secret=random(16);
    while((await Application.findOne({secret:secret}))!=null){
        secret=random(16);
    }
    return secret;
}


async function createApplication(companyid,name,comment){
    const secret=await createSecret()
    var applicaton=new Application({
        name:name,
        company_id:companyid,
        comment:comment,
        secret:secret,
        remainder:10,
        status:1
    })
    applicaton.save();
    return secret;
}

async function stopApplication(applicationid){
   Application.findByIdAndUpdate(applicationid,{$set:{status:0}},(err)=>{
       if(err)console.log(err)
   });
}

function openApplication(applicationid){
    Application.findByIdAndUpdate(applicationid,{$set:{status:1}},(err)=>{
        if(err)console.log(err)
    });
}

async function getApplication(companyid){
    return await Application.find({company_id:companyid})
}

async function getRecord(applicationid){
    return await CallRecord.find({application_id:applicationid});
}

async function get7daysRecord(applicationid){
    let lastweek=new Date();
    lastweek.setDate(lastweek.getDate()-6);
    let result=await Application.aggregate([
        {$match:{application_id:applicationid,"createdAt":{$gte:lastweek}}},
        {$group:{_id:{createdAt:"$createdAt"},count:{$sum:1}}}
    ])
    return result;
}

async function checkApplication(applicationid,secret){
    var application =await Application.findById(applicationid);
    if(application){
        return application.secret==secret
    }
    return false;
}

function checkSession(session){
    if(Redis.get(session)){
        Redis.expire(session,3600);
        return true;
    }
    else return false;
}

function getApplicationId(session){
    if(session==null)return null;
    if(checkSession(session)){
        return Redis.get(session);
    }
    else return null;
}

async function loginApplication(applicationid,secret){
    if(applicationid==null||secret==null)return null;
    if(!(await checkApplication(applicationid,secret))){
        return null;
    }
    var session=random()
    while(Redis.get(session)!=null){
        session=random()
    }
    Redis.set(session,applicationid);
    Redis.expire(session,3600);
    return session;
}

async function callAPI(applicationid,ip){
   var application=await  Application.findById(applicationid);
   if(application.remainder>0){
        application.remainder--;
        var record=new CallRecord({
            application_id:applicationid,
            ip:ip,
            type:"核验调用"
        })
        record.save();
        application.save();
        return true;
    }
   else return false;
}


module.exports={
    createApplication:createApplication,
    stopApplication:stopApplication,
    openApplication:openApplication,
    getRecord:getRecord,
    getApplicationId:getApplicationId,
    loginApplication:loginApplication,
    callAPI:callAPI,
    getApplication:getApplication,
    get7daysRecord:get7daysRecord
}