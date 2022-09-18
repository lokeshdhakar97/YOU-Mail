const mongoose = require('mongoose');

var mailModel = mongoose.Schema({
    reciverMail: String,
    subject: String,
    message: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
});

module.exports = mongoose.model('mails' , mailModel);
