#include "vntlib.h"

// 每个证书信息的结构体
typedef struct
{
    string school;		// 学校
    string name;		// 学生姓名
    string idnumber;		// 身份证号
    string degreetype;		// 学位类别
    string major;		 // 专业
    string graduationdate;	 // 毕业年月
    string studentnumber;     	 // 学号
    string certificatenumber;	// 证书编号
    string hash;		// 证书hash
} certificate;

//证书编号和证书结构体Map
KEY mapping(string,certificate)CertificatesMap;

//证书编号数组
KEY array(string)Certificatenumbers;

//部署合约的地址
KEY address owner;

//构造函数
constructor Degree()
{
    owner = GetSender();
    Certificatenumbers.length = 0;
}

//检查是否为合约主人,只有合约主人可以操作
void checkOwner()
{
    address sender = GetSender();
    Require(Equal(sender, owner) == true, "Only the owner can operate");
}

//计算证书hash
string HashCertificate(string certificatenumber, string name, string school, string degreetype, string graduationdate, string major)
{
    string data=Concat(Concat(Concat(Concat(Concat(certificatenumber,name),school),degreetype),graduationdate),major);
    return SHA3(data);
}
//存入一个证书信息
MUTABLE
void AddCertificate(string school, string name, string idnumber, string degreetype, string major, string graduationdate, string studentnumber, string certificatenumber,string hash)
{
    //检查是否为合约创建人
    checkOwner();
    //证书map添加
    CertificatesMap.key = certificatenumber;

    CertificatesMap.value.school = school;
    CertificatesMap.value.name = name;
    CertificatesMap.value.idnumber = idnumber;
    CertificatesMap.value.degreetype = degreetype;
    CertificatesMap.value.major = major;
    CertificatesMap.value.graduationdate = graduationdate;
    CertificatesMap.value.studentnumber = studentnumber;
    CertificatesMap.value.certificatenumber = certificatenumber;
    //计算hash并存入
    CertificatesMap.value.hash = HashCertificate(certificatenumber,name,school,degreetype,graduationdate,major);

    //证书编号数组添加
    uint64 nowlength = Certificatenumbers.length;
    Certificatenumbers.length = nowlength+1;
    Certificatenumbers.index = nowlength;
    Certificatenumbers.value = certificatenumber;
}

//学生注册时检测是否有证书,返回证书编号
UNMUTABLE
string ExistCertificate(string name, string studentnumber, string school, string idnumber){
    checkOwner();
    for(uint64 i = 0; i < Certificatenumbers.length ;i++){
            Certificatenumbers.index = i;
            //遍历获取证书编号
            string certificateNumber = Certificatenumbers.value;
            //根据证书编号获取证书
            CertificatesMap.key = certificateNumber;
            certificate data = CertificatesMap.value;
            //符合条件返回证书编号
            if(Equal(data.name, name) && Equal(data.studentnumber, studentnumber) && Equal(data.school ,school )&& Equal(data.idnumber ,idnumber))
            {
                return certificateNumber;
            }
    }
    //否则返回空字符串
    return "";
}

//转化证书结构体为字符串
string certificate2str(certificate data)
{
    return Concat(Concat(Concat(Concat(Concat(Concat(Concat(Concat(Concat(Concat(Concat(Concat(Concat(Concat(data.school,"|"),
                    data.name),"|"),data.idnumber),"|"),data.degreetype),"|"),data.major),"|"),data.graduationdate),"|"),data.studentnumber),"|"),data.certificatenumber);
}

//核验证书所有人身份,并查询证书信息
UNMUTABLE
string GetCertificate(string certificateNumber, string idnumber)
{
    checkOwner();
    CertificatesMap.key = certificateNumber;
    certificate data = CertificatesMap.value;
    //核验身份证号
    Require(Equal(data.idnumber, idnumber),"idnumber error!");
    return certificate2str(data);
}

//核验证书hash
UNMUTABLE
bool CheckCertificate(string certificateNumber ,string certificatenumber, string name, string school, string degreetype, string graduationdate, string major)
{
    checkOwner();
    CertificatesMap.key = certificateNumber;
    string hash = HashCertificate(certificatenumber,name,school,degreetype,graduationdate,major);
    return Equal(CertificatesMap.value.hash,hash);
}


