const blockchain=require('./blockchain/main')
const Txinfo = require('../models/txinfo')
const utils = require('./utils')

//添加证书，返回区块信息
async function addCertificate(schoolname,name,idnumber,
    degreetype,major,graduationdate,studentnumber,certificatenumber){
    let transaction =await blockchain.addCertificate(schoolname,name,idnumber,
            degreetype,major,graduationdate,studentnumber,certificatenumber)
    if(transaction){
        //插入证书交易信息
        let txinfo = Txinfo({
            certificatenumber:certificatenumber,
            transactionhash:transaction.hash
        })
        txinfo.save();
        //准备返回信息
        let resdata={
            hash:transaction.hash,
            blockNumber:transaction.blockNumber,
            blockHash:transaction.blockHash,
            gas:transaction.gas
          }
          return resdata;
    }
    else{return false};
}

async function getCertificate(certificatenumber,idnumber){
    let certificateres = blockchain.getCertificate(certificatenumber,idnumber)
    if(certificateres){
        let dataarr=certificateres.split("|")
        //对每个字段解密
        let certificate={
        "school":utils.aesDecrypt(dataarr[0]),
        "name":utils.aesDecrypt(dataarr[1]),
        "idnumber":utils.aesDecrypt(dataarr[2]),
        "degreetype":utils.aesDecrypt(dataarr[3]),
        "major":utils.aesDecrypt(dataarr[4]),
        "graduationdate":utils.aesDecrypt(dataarr[5]),
        "studentnumber":utils.aesDecrypt(dataarr[6]),
        "certificatenumber":utils.aesDecrypt(dataarr[7])
        }
        //添加区块和交易信息
        let txinfo = await Txinfo.findOne({certificatenumber:certificate.certificatenumber})
        if(txinfo){
            let transaction = await blockchain.getTransaction(txinfo.transactionhash)
            certificate['blockNumber']=transaction.blockNumber
            certificate['txhash']=txinfo.transactionhash
        }
        return certificate
    }
    else return false;
}

module.exports={
    addCertificate:addCertificate,
    getCertificate:getCertificate
}