const privateinfo=require("./private")
const databaseUrl = privateinfo.mongodb_url;
const emailConfig={
	email:"xinyiteam2021@126.com",
	host:"smtp.126.com",
	port:465,
	pass:privateinfo.email_pass,
	webname:"信诣团队"
}
const donainname="http://192.168.0.25"
module.exports={
	databaseUrl:databaseUrl,
	emailConfig:emailConfig,
	donainname:donainname
}
