const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/youMailDB');

var userSchema = mongoose.Schema({
    fullname: String,
    username: String,
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: String,
    gender: String,
    profilePic: {
        type: String,
        default: "default.png"
    },
    sentMails: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "mails"
    }],
    recivedMails: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "mails"
    }],
    
}, 
{
    timestamps: true,
}
);

userSchema.plugin(plm);

module.exports = mongoose.model('user' , userSchema);