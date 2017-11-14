var mongoose = require('mongoose');

var passwordResetSchema = mongoose.Schema({
	userId : { type : String, require : '{PATH} is required' },
	token : { type : String, require : '{PATH} is required'  },
	created : { type : Date, require : '{PATH} is required', default: Date.now },
	updated : { type : Date, require : '{PATH} is required', default: Date.now }
});

var PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

module.exports = {
	PasswordReset : PasswordReset
}