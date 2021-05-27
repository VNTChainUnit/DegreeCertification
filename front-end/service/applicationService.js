const  utils=require('./utils') 
const Application=require('../models/application')
const CallRecord=require('../models/callRecord')
const random=require("string-random");
const Redis=require('./redisService')
const mongoose=require('mongoose')

async function createSecret(){
    let secret=random(16);
    while((await Application.findOne({secret:secret}))!=null){
        secret=random(16);
    }
    return secret;
}


async function createApplication(companyid,name,comment){
    const secret=await createSecret()
    let applicaton=new Application({
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

function sortByDate(a, b)
{
return a._id > b._id;
}

async function get7daysRecord(applicationid){
    let lastweek=new Date();
    lastweek.setHours(0);
    lastweek.setMinutes(0);
    lastweek.setSeconds(0);
    lastweek.setMilliseconds(0);
    lastweek.setDate(lastweek.getDate()-6);
    let result=await CallRecord.aggregate([
        {"$match":{application_id:mongoose.Types.ObjectId(applicationid),createdAt:{$gte:lastweek}}},
        {"$project" : { day : {$substr: ["$createdAt", 0, 10] }}},
        {"$group":{_id:"$day",count:{$sum:1}}}
    ])
    result.sort(sortByDate);
    let res=[0,0,0,0,0,0,0]
    let th=0;
    let nowdate=lastweek;
    for(let i=0;i<7&&th<result.length;i++){
        const datestr=utils.getDateStr(nowdate)
        if(datestr==result[th]._id){
            res[i]=result[th++].count;
        }
        nowdate.setDate(nowdate.getDate()+1);
    }
    return res;
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
    while(await Redis.get(session)!=null){
        session=random()
    }
    await Redis.set(session,applicationid);
    Redis.expire(session,3600);
    return session;
}

async function callAPI(applicationid,ip){
   var application=await  Application.findById(applicationid);
   if(application.remainder>0){
        application.remainder--;
        let record=new CallRecord({
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