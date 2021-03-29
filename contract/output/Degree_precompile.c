#include "vntlib.h"

                                 
typedef struct
{
    string school;		         
    string name;		               
    string idnumber;		               
    string degreetype;		               
    string major;		          
    string graduationdate;	                
    string studentnumber;     	          
    string certificatenumber;	               
    string hash;		             
} certificate;

                                   
KEY mapping(string,certificate)CertificatesMap;

                    
KEY array(string)Certificatenumbers;

                       
KEY address owner;

              

void keyg2c42jqk(){
AddKeyInfo( &CertificatesMap.value.certificatenumber, 6, &CertificatesMap, 9, false);
AddKeyInfo( &CertificatesMap.value.certificatenumber, 6, &CertificatesMap.key, 6, false);
AddKeyInfo( &CertificatesMap.value.certificatenumber, 6, &CertificatesMap.value.certificatenumber, 9, false);
AddKeyInfo( &CertificatesMap.value.graduationdate, 6, &CertificatesMap, 9, false);
AddKeyInfo( &CertificatesMap.value.graduationdate, 6, &CertificatesMap.key, 6, false);
AddKeyInfo( &CertificatesMap.value.graduationdate, 6, &CertificatesMap.value.graduationdate, 9, false);
AddKeyInfo( &CertificatesMap.value.school, 6, &CertificatesMap, 9, false);
AddKeyInfo( &CertificatesMap.value.school, 6, &CertificatesMap.key, 6, false);
AddKeyInfo( &CertificatesMap.value.school, 6, &CertificatesMap.value.school, 9, false);
AddKeyInfo( &Certificatenumbers.length, 4, &Certificatenumbers, 9, false);
AddKeyInfo( &CertificatesMap.value.degreetype, 6, &CertificatesMap, 9, false);
AddKeyInfo( &CertificatesMap.value.degreetype, 6, &CertificatesMap.key, 6, false);
AddKeyInfo( &CertificatesMap.value.degreetype, 6, &CertificatesMap.value.degreetype, 9, false);
AddKeyInfo( &CertificatesMap.value.major, 6, &CertificatesMap, 9, false);
AddKeyInfo( &CertificatesMap.value.major, 6, &CertificatesMap.key, 6, false);
AddKeyInfo( &CertificatesMap.value.major, 6, &CertificatesMap.value.major, 9, false);
AddKeyInfo( &CertificatesMap.value.name, 6, &CertificatesMap, 9, false);
AddKeyInfo( &CertificatesMap.value.name, 6, &CertificatesMap.key, 6, false);
AddKeyInfo( &CertificatesMap.value.name, 6, &CertificatesMap.value.name, 9, false);
AddKeyInfo( &CertificatesMap.value.studentnumber, 6, &CertificatesMap, 9, false);
AddKeyInfo( &CertificatesMap.value.studentnumber, 6, &CertificatesMap.key, 6, false);
AddKeyInfo( &CertificatesMap.value.studentnumber, 6, &CertificatesMap.value.studentnumber, 9, false);
AddKeyInfo( &CertificatesMap.value.hash, 6, &CertificatesMap, 9, false);
AddKeyInfo( &CertificatesMap.value.hash, 6, &CertificatesMap.key, 6, false);
AddKeyInfo( &CertificatesMap.value.hash, 6, &CertificatesMap.value.hash, 9, false);
AddKeyInfo( &CertificatesMap.value.idnumber, 6, &CertificatesMap, 9, false);
AddKeyInfo( &CertificatesMap.value.idnumber, 6, &CertificatesMap.key, 6, false);
AddKeyInfo( &CertificatesMap.value.idnumber, 6, &CertificatesMap.value.idnumber, 9, false);
AddKeyInfo( &Certificatenumbers.value, 6, &Certificatenumbers, 9, false);
AddKeyInfo( &Certificatenumbers.value, 6, &Certificatenumbers.index, 4, true);
AddKeyInfo( &owner, 7, &owner, 9, false);
}
constructor Degree()
{
keyg2c42jqk();
InitializeVariables();
    owner = GetSender();
    Certificatenumbers.length = 0;
}

                                                            
void checkOwner()
{
    address sender = GetSender();
    Require(Equal(sender, owner) == true, "Only the owner can operate");
}

                  
string HashCertificate(string certificatenumber, string name, string school, string degreetype, string graduationdate, string major)
{
    return SHA3(Concat(Concat(Concat(Concat(Concat(certificatenumber,name),school),degreetype),graduationdate),major));
}

                          
MUTABLE
void AddCertificate(string school, string name, string idnumber, string degreetype, string major, string graduationdate, string studentnumber, string certificatenumber)
{
keyg2c42jqk();
                                    
    checkOwner();
                     
    CertificatesMap.key = certificatenumber;

    CertificatesMap.value.school = school;
    CertificatesMap.value.name = name;
    CertificatesMap.value.idnumber = idnumber;
    CertificatesMap.value.degreetype = degreetype;
    CertificatesMap.value.major = major;
    CertificatesMap.value.graduationdate = graduationdate;
    CertificatesMap.value.studentnumber = studentnumber;
    CertificatesMap.value.certificatenumber = certificatenumber;
                         
    CertificatesMap.value.hash = HashCertificate(certificatenumber,name,school,degreetype,graduationdate,major);

                              
    uint64 nowlength = Certificatenumbers.length;
    Certificatenumbers.length = nowlength+1;
    Certificatenumbers.index = nowlength;
    Certificatenumbers.value = certificatenumber;
}

                                                         
UNMUTABLE
string ExistCertificate(string name, string studentnumber, string school, string idnumber){
keyg2c42jqk();
    checkOwner();
    for(uint64 i = 0; i < Certificatenumbers.length ;i++){
            Certificatenumbers.index = i;
                                      
            string certificateNumber = Certificatenumbers.value;
                                            
            CertificatesMap.key = certificateNumber;
            KEY certificate data = CertificatesMap.value;
                                            
            if(Equal(data.name, name) && Equal(data.studentnumber, studentnumber) && Equal(data.school ,school )&& Equal(data.idnumber ,idnumber))
            {
                return certificateNumber;
            }
    }
                              
    return "";
}

                                                   
UNMUTABLE
string GetCertificate(string certificateNumber, string idnumber)
{
keyg2c42jqk();
    checkOwner();
    CertificatesMap.key = certificateNumber;
                        
    Require(Equal(CertificatesMap.value.idnumber, idnumber),"idnumber error!");
    return Concat(Concat(Concat(Concat(Concat(Concat(Concat(Concat(Concat(Concat(Concat(Concat(Concat(Concat(CertificatesMap.value.school,"|"),
                    CertificatesMap.value.name),"|"),CertificatesMap.value.idnumber),"|"),CertificatesMap.value.degreetype),"|"),CertificatesMap.value.major),"|"),
                    CertificatesMap.value.graduationdate),"|"),CertificatesMap.value.studentnumber),"|"),CertificatesMap.value.certificatenumber);
}

                  
UNMUTABLE
bool CheckCertificate(string certificatenumber, string name, string school, string degreetype, string graduationdate, string major)
{
keyg2c42jqk();
    checkOwner();
    CertificatesMap.key = certificatenumber;
                                                         
    string hash = HashCertificate(certificatenumber,name,school,degreetype,graduationdate,major);
    return Equal(CertificatesMap.value.hash,hash);
}
