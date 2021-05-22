var nodemailer  = require("nodemailer");
const emailConfig=require("../config").emailConfig
var user = emailConfig.email
  , pass = emailConfig.pass
  ;
var smtpTransport = nodemailer.createTransport( {
      host:emailConfig.host,
      secure: true,
     port: emailConfig.port

    , auth: {
        user: user,
        pass: pass
    }
  });

function sendEmail(to,subject,content){
    smtpTransport.sendMail({
    from    : emailConfig.webname+'<' + user + '>'
  , to      : to
  , subject : subject
  , html    : content
}, function(err, res) {
    console.log(err, res);
});
}

module.exports={
    sendEmail:sendEmail
}