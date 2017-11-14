var mongoose = require('mongoose');

var mailBodySchema = mongoose.Schema({
	title : { type : String, require : '{PATH} is required' },
	code : { type : String, require : '{PATH} is required' },
	detail : { type : String, require : '{PATH} is required' },
	created : { type : Date, require : '{PATH} is required', default: Date.now },
	updated : { type : Date, require : '{PATH} is required', default: Date.now }
});

var MailBody = mongoose.model('MailBody', mailBodySchema);

function createDefaultMailBodies() {
	MailBody.find({}).exec(function (err, collection) { 
		if (collection.length === 0) {
			MailBody.create({ title : 'Registration mail' , code : 'REGISTRATION_MAIL' ,detail : ''});
			MailBody.create({ title : 'Forgot password' , code : 'FORGOT_PASSWORD', detail : '' });
			MailBody.create({ title : 'Deleted account' , code : 'ACCOUNT_DELETED', detail : '' });
			MailBody.create({ title : 'Newsletter one' , code : 'NL', detail : 'Welcome this is news letter 1' });			
			MailBody.create({ title : 'Newsletter two' , code : 'NL', detail : 'Welcome this is news letter 2' });			
		}
	});
}

module.exports = {
	createDefaultMailBodies : createDefaultMailBodies,
	MailBody : MailBody
}