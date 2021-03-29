var fs = require('fs');
var Vnt = require("vnt")
var vntkit = require("vnt-kit")
var TX= require("ethereumjs-tx")
const path=require('path')
const Common=require('./common')
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

function sendRawTransaction(account, to, data, value) {
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
    vnt.core.sendRawTransaction(
        '0x' + serializedTx.toString('hex'), function (err, txHash) {
            if (err) {
                console.log('err happened: ', err);
                console.log('transaction hash: ', txHash);
            } else {
                console.log('transaction hash: ', txHash);
            }
        });
}

//存入一个证书
function addCertificate(school, name, idnumber, degreetype, major, graduationdate, studentnumber, certificatenumber){
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("AddCertificate", [school, name, idnumber, degreetype, major, graduationdate, studentnumber, certificatenumber]);
    sendRawTransaction(account, contractAddress, data, vnt.toHex(0));
}

//获取证书信息
function getCertificate(certificateNumber, idnumber){
    var contract = vnt.core.contract(abi).at(contractAddress);
    var res = contract.GetCertificate.call(certificateNumber,idnumber,{from:account.address});
    console.log(res.toString());
    return res.toString();
}

//学生注册,返回证书编号
function existCertificate(name, studentnumber, school, idnumber){
    var contract = vnt.core.contract(abi).at(contractAddress);
    var res = contract.ExistCertificate.call(name, studentnumber, school, idnumber, {from:account.address});
    console.log(res.toString());
    return res.toString();
}

//核验证书
function checkCertificate(certificatenumber, name, school, degreetype, graduationdate, major){
    var contract = vnt.core.contract(abi).at(contractAddress);
    var res = contract.CheckCertificate.call( certificatenumber, name, school, degreetype, graduationdate, major,  {from:account.address});
    console.log(res.toString());
    return res.toString();
}

// var  school="学校名"
// var name="学生名";
// var idnumber="idcardnumber";
// var degreetype="学士学位"  //master,doctor
// var major="软件工程"
// var graduationdate="2022-06"
// var studentnumber="201831"
// var certificatenumber="1certi"

module.exports={
    addCertificate:addCertificate,
    getCertificate:getCertificate,
    existCertificate:existCertificate,
    checkCertificate:checkCertificate,
}