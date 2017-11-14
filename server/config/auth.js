var passport = require('passport'),
	mongoose = require("mongoose");

exports.authenticate = function (req, res, next) {
	req.body.username = req.body.username.toLowerCase();
	var auth = passport.authenticate('local', function (err, user, failure) {
		if (err) return next(err);
		if (!user) {
			res.send({ success : false, message : failure.message });
		}

		req.login(user, function (err) {
			if (err) return next(err);

			res.send({ success : true, user : user });			
		});
				
	});
	auth(req, res, next);

}
exports.requireApiLogin = function (req, res, next) {
	if (!req.isAuthenticated()) {
		res.status(403);
		res.end();
	}
	else {
		next();
	}
};

exports.requiresRole = function (role) {
	return function (req, res, next) {
		if (!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
			res.status(403);
			res.end();
		}
		else {
			next();
		}
	}
}