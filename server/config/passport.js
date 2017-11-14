var passport = require('passport'),
	mongoose = require("mongoose"),
	LocalStrategy = require('passport-local').Strategy,
	User = mongoose.model('User'),
	_constants = require('../utility/constants'),
	_siteHelpers = require('../utility/siteHelpers');

module.exports = function () { 

	passport.use(new LocalStrategy(
		function (username, password, done) {
			User.findOne({ username: username }, function (err, user) {
				if (err) { return done(err); }
				
				// Username not found
				if (!user) {
					return done(null, false, { message:  _constants.messages.INVALID_USERNAME });
				}					
				
				// password not matched
				if (user.password !== _siteHelpers.computeHash(password, user.salt)) {
					return done(null, false, { message: _constants.messages.INVALID_PASSWORD });
				}

				// Check if email is verified
				if (!user.isVerified) {
					return done(null, false, { message: _constants.messages.PLEASE_VERIFY_YOUR_EMAIL });
				}

				// Check if email is verified
				if (!user.isActive) {
					return done(null, false, { message: _constants.messages.ACCOUNT_DELETED_CONTACT_ADMIN });
				}	
				
				return done(null, user);
			});
		}
	));
	
	passport.serializeUser(function (user, next) {
		if (user) {
			next(null, user._id);
		}
	});
	
	passport.deserializeUser(function (id, next) {
		User.findOne({ _id : id }).exec(function (err, user) {
			if (user) {
				return next(null, user);
			}
			else {
				return next(err, false);
			}
		});
	});

}