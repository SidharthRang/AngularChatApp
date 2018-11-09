var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var MessageSchema = mongoose.Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    timestamp: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
});

var Messages = mongoose.model('Messages', MessageSchema);

module.exports = { Messages };