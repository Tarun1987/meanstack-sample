var mongoose = require('mongoose');

var mailSentSchema = mongoose.Schema({
	to : { type : String },
	from : { type : String},
	subject : { type: String},
	html : { type: String},
	created : { type : Date, default: Date.now }
});

var MailSent = mongoose.model('MailSent', mailSentSchema);

module.exports = {
	MailSent : MailSent
}