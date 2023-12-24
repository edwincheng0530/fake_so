// Answer Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let AnswerInstanceSchema = new Schema({
    text: {type: String, required: true},
    ans_by: {type: Schema.Types.ObjectId, ref:'User', required: true},
    ans_date_time: {type: Date, default: Date.now()},
    comments: [{type:Schema.Types.ObjectId, ref: 'Comment'}],
    upvote: {type: Number, default: 0},
    upvotes: [{type: String}],
    downvotes: [{type: String}]
});

AnswerInstanceSchema.virtual('url').get(function() {
    return '/posts/answer/' + this._id;
})

module.exports = mongoose.model('Answer', AnswerInstanceSchema)
