var mongoose = require('mongoose');

var notificationSchema = mongoose.Schema({
    sender: {
        id: { type: String, require: '{PATH} is required' },
        name: { type: String, require: '{PATH} is required' }
    },
    type: { type: String, require: '{PATH} is required' },
    subType: { type: String, require: '{PATH} is required' },
    url: { type: String, require: '{PATH} is required' },
    created: { type: Date, require: '{PATH} is required', default: Date.now }
});

var Notification = mongoose.model('Notification', notificationSchema);

module.exports = {
    Notification: Notification
}