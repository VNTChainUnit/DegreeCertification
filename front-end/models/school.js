/* models/school.js */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//学校类
const SchoolSchema = new Schema({
        //学校姓名
        name: {type: String},
        code: {type: String},
        username: {type: String},
        password: {type: String},
        //学生ids
        student_ids: [Schema.Types.ObjectId]
    },
    {timestamps: true}
);

module.exports = mongoose.model('School',SchoolSchema);
