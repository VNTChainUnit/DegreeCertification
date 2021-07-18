var fs = require('fs');
var Vnt = require("vnt")
var vntkit = require("vnt-kit")
var TX= require("ethereumjs-tx")
const path=require('path')
const Common=require('./common')
const aesDecrypt = require('../utils').aesDecrypt
const aesEncrypt = require('../utils').aesEncrypt

// 设置连接的节点
var vnt = new Vnt();
vnt.setProvider(new vnt.providers.HttpProvider(Common.url));
var contractAddress = Common.contractAddress;

var chainid = 2;
// 合约部署地址

// 解锁用户
var filePath = path.resolve(__dirname,Common.accountPath)
var password = Common.accountPassword

function openAccount(file, passwd) {
    var content = fs.readFileSync(file).toString("utf-8")
    return vntkit.account.decrypt(content, passwd, false)
}
try{
    var account = openAccount(filePath, password)
    console.log("open account successfully!")
}catch(err){
    console.log(err.message)
}

//将abi数据解析成json结构
var wasmabi = fs.readFileSync(path.resolve(__dirname,Common.abifile))
var abi = JSON.parse(wasmabi.toString("utf-8"))

//下面为各个函数

async function sendRawTransaction(account, to, data, value) {
    var nonce = vnt.core.getTransactionCount(account.address);
    var options = {
        nonce: nonce,
        to: to,
        gasPrice: vnt.toHex(vnt.toWei(18, 'Gwei')),
        gasLimit: vnt.toHex(4000000),
        data: data,
        value: value,
        chainId: chainid
    };
    var tx = new TX(options);
    tx.sign(new Buffer(
        account.privateKey.substring(
            2,
        ),
        'hex'));
    var serializedTx = tx.serialize();
    var txHash=""
    try{
        txHash= await vnt.core.sendRawTransaction(
        '0x' + serializedTx.toString('hex'));
    }
    catch(err){
        txHash=null
    }
        return txHash
}

//存入一个证书,返回交易信息
async function addCertificate(school, name, idnumber, degreetype, major, graduationdate, studentnumber, certificatenumber){
    //存入时加密
    school=aesEncrypt(school)
    name = aesEncrypt(name)
    idnumber = aesEncrypt(idnumber)
    degreetype = aesEncrypt(degreetype)
    major = aesEncrypt(major)
    graduationdate = aesEncrypt(graduationdate)
    studentnumber = aesEncrypt(studentnumber)
    certificatenumber = aesEncrypt(certificatenumber)

    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("AddCertificate", [school, name, idnumber, degreetype, major, graduationdate, studentnumber, certificatenumber]);
    //获取交易hash
    let txHash= await sendRawTransaction(account, contractAddress, data, vnt.toHex(0));
    //获取交易数据并返回，如果没有返回false
    if(txHash){
        var result=await getTransaction(txHash)
        return result
    }
    else return false;
}

//根据交易hash获取交易，默认请求100次
async function getTransaction(transactionhash){
    var result=""
    let trytime=100
    while(trytime-->=0){
        result=vnt.core.getTransaction(transactionhash)
        if(result && result.blockNumber){
            console.log(trytime);
            break;
        }
    }
    return result
}

//获取证书信息
function getCertificate(certificateNumber, idnumber){
    //加密参数
    certificateNumber = aesEncrypt(certificateNumber)
    idnumber = aesEncrypt(idnumber)
    var contract = vnt.core.contract(abi).at(contractAddress);
    var res = contract.GetCertificate.call(certificateNumber,idnumber,{from:account.address});
    //返回原始的，之后再解密
    return res.toString();
}

//学生注册,返回证书编号
function existCertificate(name, studentnumber, school, idnumber){
    //加密参数
    name = aesEncrypt(name)
    studentnumber = aesEncrypt(studentnumber)
    school = aesEncrypt(school)
    idnumber = aesEncrypt(idnumber)
    var contract = vnt.core.contract(abi).at(contractAddress);
    var res = contract.ExistCertificate.call(name, studentnumber, school, idnumber, {from:account.address});
    //解密返回值
    if(res=="")return res;
    res=aesDecrypt(res)
    console.log(res.toString());
    return res.toString();
}

//核验证书
function checkCertificate(certificatenumber, name, school, degreetype, graduationdate, major){
    //加密参数
    certificatenumber=aesEncrypt(certificatenumber)
    name=aesEncrypt(name)
    school=aesEncrypt(school)
    degreetype=aesEncrypt(degreetype)
    graduationdate=aesEncrypt(graduationdate)
    major=aesEncrypt(major)
    var contract = vnt.core.contract(abi).at(contractAddress);
    var res = contract.CheckCertificate.call( certificatenumber, name, school, degreetype, graduationdate, major,  {from:account.address});
    console.log(res.toString());
    if(res.toString()=="true"){
        return true
    }
    else{return false}
}

module.exports={
    addCertificate:addCertificate,
    getCertificate:getCertificate,
    existCertificate:existCertificate,
    checkCertificate:checkCertificate,
    getTransaction:getTransaction
}