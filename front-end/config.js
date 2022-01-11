const privateinfo=require("./private")
const databaseUrl = privateinfo.mongodb_url;
const emailConfig={
	email:"xinyiteam2021@126.com",
	host:"smtp.126.com",
	port:465,
	pass:privateinfo.email_pass,
	webname:"信诣团队"
}
const redisConfig={
	host:privateinfo.redis_url,
	port:privateinfo.redis_port,
	password:privateinfo.redis_pass
}
const donainname="https://xinyi.laoluoli.com"
module.exports={
	databaseUrl:databaseUrl,
	emailConfig:emailConfig,
	donainname:donainname,
	redisConfig:redisConfig,
	sign_secret:privateinfo.sign_secret,
	appSecret:privateinfo.secret
}
