var fs = require('fs');
var Vnt = require("vnt")
var vntkit = require("vnt-kit")
var TX= require("ethereumjs-tx")
// 设置连接的节点
var vnt = new Vnt();
vnt.setProvider(new vnt.providers.HttpProvider("http://47.111.100.232:8880"));
var contractAddress = '0x98be785dee077e3ef55b546400db620a6d6fc39c';

// var contractAddress = '0x10B05EF130599dB76A8D9bC3E9235D7075415419';
// vnt.setProvider(new vnt.providers.HttpProvider("http://127.0.0.1:8545"));
var chainid = 2;
// 合约部署地址

// 解锁用户
var ksDir = "/home/lemon/Project/vntchain/test/"
var kFile1 = "UTC--2021-02-05T23-22-11.465260418Z--46a1a94e8a2572621020428fea1485f854c27b6c"
var pass1 = ""

function openAccount(file, passwd) {
    var content = fs.readFileSync(file).toString("utf-8")
    return vntkit.account.decrypt(content, passwd, false)
}
try{
    var account = openAccount(ksDir + kFile1, pass1)
    console.log(account)
}catch(err){
    console.log(err.message)
}

// 准备代码和abi
var codeFile = "/home/lemon/Project/vntchain/DegreeCertification/contract/output/Degree.compress"
var abiFile = "/home/lemon/Project/vntchain/DegreeCertification/contract/output/Degree.abi"
var wasmabi = fs.readFileSync(abiFile)
//将abi数据解析成json结构
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

// function getCertificate(certificateNumber, idnumber){
//     var contract = vnt.core.contract(abi);
//     var data = contract.packFunctionData("GetCertificate", [certificateNumber,idnumber]);
//     var result = vnt.core.call({to:contractAddress,data:data})
//     console.log(result.toString());
//     console.log(contract.unPackOutput("GetCertificate", result).toString())
//     return result.toString();
// }
var  school="学校名"
var name="学生名";
var idnumber="idcardnumber";
var degreetype="学士学位"  //master,doctor
var major="软件工程"
var graduationdate="2022-06"
var studentnumber="201831"
var certificatenumber="1certi"
//addCertificate(school,name,idnumber,degreetype,major,graduationdate,studentnumber,certificatenumber);
//getCertificate(certificatenumber+"ss", idnumber)


//existCertificate(name,studentnumber,school,idnumber);


checkCertificate(certificatenumber+"ss",name,school,degreetype,graduationdate,major)

