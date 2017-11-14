var mongoose = require("mongoose"),
	_sitehelpers = require('../utility/siteHelpers');

// Set the user schema
var UserSchema = mongoose.Schema({
	firstName: { type : String, required : '{PATH} is required!' },
	lastName : { type : String, required : '{PATH} is required!' },
	username : {
		type : String, 
		required : '{PATH} is required!',
		unique : true
	},
	pic     : { type : String, default : '/website/images/user/user.png' },
	salt     : { type : String, required : '{PATH} is required!' },
	password : { type : String, required : '{PATH} is required!' },
	isActive : { type : Boolean, default: true },
	isVerified : { type : Boolean, default: false },
	provider : { type: String, default: 'website' },
	providerId : { type: String},
	roles    : [String],
	created : { type : Date, default: Date.now },
	referredBy : { type : String }
});

var User = mongoose.model('User', UserSchema);

function createDefaultUsers() {
	User.find({}).exec(function (err, collection) {
		if (collection.length === 0) {
			var salt = _sitehelpers.createSalt();
			User.create({ firstName : 'Tarun' , lastName : 'Khatana', username : 'tkhatana', isVerified : true, salt : salt, password : crypto.computeHash('123456', salt), roles : ["admin"] });
		}
	});
}

module.exports = {
	createDefaultUsers : createDefaultUsers,
	User : User
}