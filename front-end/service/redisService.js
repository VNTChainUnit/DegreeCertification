const redis = require("redis");
const config = require("../config");
let c = config.redisConfig,
    client = redis.createClient(c.port, c.host, {
        auth_pass:c.password
    });
 
client.on("error",function(err){
    console.log(err);
});
 
function Redis() {}
 
let text = async(key)=>{
    let doc = await new Promise( (resolve) => {
        client.get(key,function(err, res){
            return resolve(res);
        });
    });
    return JSON.parse(doc);
};
 
Redis.set = function(key, value) {
    value = JSON.stringify(value);
    return client.set(key, value, function(err){
        if (err) {
            console.error(err);
        }
    });
};
 
Redis.get = async(key)=>{
    return await text(key);
};
 
/**
 * 
 * @param {键} key 
 * @param {过期时间：秒} time 
 * @returns 
 */
Redis.expire = function(key, time) {
    return client.expire(key, time);
};
 
module.exports = Redis;
