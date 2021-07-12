const mongoose = require('mongoose');
const url=require('../config').databaseUrl;
mongoose.connect(url, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error',console.log);

db.once('open',()=>{console.log('success!')});
module.exports=db