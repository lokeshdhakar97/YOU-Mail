const mongoose = require('mongoose');

var mailModel = mongoose.Schema({
    reciverMail: String,
    subject: String,
    message: String,
    senderUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    recieverUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
});

module.exports = mongoose.model('mails' , mailModel);
