// Question Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let QuestionInstanceSchema = new Schema({
    title: {type: String, required: true, maxLength: 50},
    text: {type: String, required: true},
    summary: {type: String, default: '', required: true},
    tags: [{type: Schema.Types.ObjectId, ref: 'Tag', required: true}],
    answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
    asked_by: {type: Schema.Types.ObjectId, ref:'User', required: true},
    ask_date_time: {type: Date, default: Date.now()},
    views: {type: Number, default:0},
    upvote: {type: Number, default: 0},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    upvotes: [{type: String}],
    downvotes: [{type: String}]
});




QuestionInstanceSchema.virtual('url').get(function() {
    return '/post/question/' + this._id;
})

module.exports = mongoose.model('Question', QuestionInstanceSchema);