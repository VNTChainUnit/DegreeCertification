/* models/callRecord.js */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//调用记录
const CallRecordSchema = new Schema({
        ip: {type: String},
        type: {type: String},
        application_id:{type:Schema.Types.ObjectId}
    },
    {timestamps: true}
);

module.exports = mongoose.model('CallRecord ',CallRecordSchema,"callRecords");
