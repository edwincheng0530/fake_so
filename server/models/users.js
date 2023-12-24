const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let UserInstanceSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    join_time: {type: Date, default: Date.now(), timezone: 'America/New_York'},
    reputation: {type: Number, default: 0},
    admin: {type: Boolean, default: false}
});

UserInstanceSchema.virtual('url').get(function(){
    return '/post/user/' + this._id;
})

module.exports = mongoose.model('User', UserInstanceSchema);