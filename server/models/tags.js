// Tag Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let TagInstanceSchema = new Schema({
    name: {type: String, required: true},
    create_by: {type: Schema.Types.ObjectId, ref: 'User', required: true} 
});

TagInstanceSchema.virtual('url').get(function() {
    return '/post/tag/' + this._id;
})

module.exports = mongoose.model('Tag', TagInstanceSchema);