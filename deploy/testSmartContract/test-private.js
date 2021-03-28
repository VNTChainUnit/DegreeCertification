var fs = require('fs');
var Vnt = require("vnt")
var vntkit = require("vnt-kit")
var TX= require("ethereumjs-tx")
// 设置连接的节点
var vnt = new Vnt();
vnt.setProvider(new vnt.providers.HttpProvider("http://47.111.100.232:8880"));
var contractAddress = '0x2cb91f8058ec6663170999e82624f5440dcd9be4';

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

//vnt.personal.unlockAccount(account.address,pass1);

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
    var contract = vnt.core.contract(abi).at(contractAddress);
    contract.AddCertificate.sendTransaction(school, name, idnumber, degreetype, major, graduationdate, studentnumber, certificatenumber,
        {from:account.address}, function(err,txid){
            if(err) {
                console.log("error happend: ", err)
            } else {
                getTransactionReceipt(txid, function(receipt) {
                    console.log("status: ", receipt.status)
                    GetAmount(to)
                })
            }
        });
    
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
var  school="zjnu"
var name="fay";
var idnumber="1idcard";
var degreetype="benke"
var major="se"
var graduationdate="2022-06"
var studentnumber="201831"
var certificatenumber="1certi"
addCertificate("zjnu","fay","1idcard","benke","se","2022-06","201831","1certi");
//getCertificate("1certi", "1idcard")

//addCertificate("2zjnu","2fay","21idcard","2benke","2se","22022-06","2201831","21certi","2hash");
//getCertificate("21certi", "21idcard")

//existCertificate(name,studentnumber,school,idnumber);


//checkCertificate(certificatenumber,name,school,degreetype,graduationdate,idnumber,major)
