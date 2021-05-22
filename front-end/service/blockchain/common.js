const privateinfo=require("../../private")
const abifile="Degree.abi"
const contractAddress=privateinfo.vnt_contractAddress
const url="http://47.111.100.232:8880"
const accountPath="./owneraccount"
const accountPassword=privateinfo.vnt_accountpwd
module.exports={
    abifile:abifile,
    url:url,
    contractAddress:contractAddress,
    accountPath:accountPath,
    accountPassword:accountPassword
}
