const  utils=require('./utils') 
const Application=require('../models/application')
const CallRecord=require('../models/callRecord')
const random=require("string-random");
const rdClient = require('redis').createClient(6379, '127.0.0.1');

async function createSecret(){
    const secret=random(16);
    while((await Application.findOne({secret:secret}))==null){
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

function stopApplication(applicationid){
    Application.updateOne({_id:applicationid},{status:0});
}

function openApplication(applicationid){
    Application.updateOne({_id:applicationid},{status:1});
}

async function getRecord(applicationid){
    return await CallRecord.find({application_id:applicationid});
}

async function checkApplication(applicationid,secret){
    
}

async function login(applicationid,secret){

}

module.exports={
    createApplication:createApplication,
    stopApplication:stopApplication,
    openApplication:openApplication,
    getRecord:getRecord
}