const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CommentInstanceSchema = new Schema({
    text: {type: String, required: true},
    comm_by: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    upvote: {type: Number, default: 0},
    upvotes: [{type: String}]
});

CommentInstanceSchema.virtual('url').get(function(){
    return '/post/comment/' + this._id;
})

module.exports = mongoose.model('Comment', CommentInstanceSchema);