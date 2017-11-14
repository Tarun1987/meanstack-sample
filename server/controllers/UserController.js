var _userService = require('../core/dal/UserService'),
	_fileUploadService = require('../core/dal/FileUploadService'),
	_userInfoService = require('../core/dal/UserInfoService'),
	_passwordResetService = require('../core/dal/PasswordResetService'),
	_emailSendingService = require('../core/dal/EmailSenderService'),
	_loggerService = require('../core/dal/ErrorLoggerService'),
	_notificationService = require('../core/dal/NotificationService'),
	FailureResponse = require('../core/dto/FailureResponse'),
	ASQ = require("asynquence"),
	_siteHelpers = require('../utility/siteHelpers'),
	_constants = require('../utility/constants'),
	_helpers = require('../utility/responseHelper');

// GET All users
exports.getAll = function (req, res) {
	ASQ(req.query)
		.then(_userService.getAll)
		.then(function (_, list) {
			res.send(list);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
};

// GET Recently Added User
exports.getRecentlyAddedUser = function (req, res) {
	ASQ({ limit: 5, orderBy: 'createdBy' })
		.then(_userService.getRecentlyAddedUser)
		.then(function (_, list) {
			res.send(list);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
};

// Get all users count
exports.getAllCount = function (req, res) {
	ASQ(req.query)
		.then(_userService.getAllCount)
		.then(function (_, data) {
			return _helpers.responseType.Ok(res, data);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

// GET Single record by ID
exports.getById = function (req, res) {
	ASQ(req.params.userId)
		.then(_userService.getById)
		.then(function (_, result) {
			if (!result.user) {
				done.fail(new FailureResponse(404, _constants.messages.USER_NOT_FOUND));
			} else {
				return _helpers.responseType.Ok(res, result);
			}
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

// Create new users
exports.create = function (req, res, next) {
	var userData = req.body;
	var _pass = req.body.password;
	userData.salt = _siteHelpers.createSalt();
	userData.password = _siteHelpers.computeHash(userData.password, userData.salt);
	userData.username = userData.username.toLowerCase();

	ASQ(userData)
		.then(_userService.createNew)
		.then(function (_, result) {

			// users comming via facebook are already verified
			// So no verification email to be send. 
			if (userData.provider != _constants.SignUpType.Facebook) {

				// if this is a referral email then send referral email
				if (userData.referredBy) {
					_emailSendingService.sendReferralEmail(userData, _pass);
				}
				else {
					_emailSendingService.sendAccountVerificationEmail(result.user);
				}
			}

			return _helpers.responseType.Success(res, _constants.messages.USER_CREATE_SUCCESS);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
};

// Update user details
exports.update = function (req, res) {
	var id = req.body._id;
	ASQ(id)
		.then(_userService.getById)
		.then(function (done, result) {
			if (!result.user) {
				done.fail(new FailureResponse(404, _constants.messages.USER_NOT_FOUND));
			} else {
				var fieldsToUpdate = {};
				if (req.body.firstName)
					fieldsToUpdate.firstName = req.body.firstName;
				if (req.body.lastName)
					fieldsToUpdate.lastName = req.body.lastName;

				var obj = {
					id: id,
					fieldsToUpdate: fieldsToUpdate
				}

				done(obj);
			}
		})
		.then(_userService.update)
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.USER_UPDATE_SUCCESS);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

// Delete user
exports.remove = function (req, res) {
	var id = req.query.id
	ASQ(id)
		.then(_userService.getById)
		.then(function (done, result) {
			if (!result.user) {
				done.fail(new FailureResponse(404, _constants.messages.USER_NOT_FOUND));
			} else {
				done(id);
			}
		})
		.then(_userService.delete)
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.USER_DELETED_SUCCESS);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

// Deactivate account
exports.activateDeactivateUser = function (req, res) {
	var globalObj = {
		id: req.body.id,
		status: req.body.status
	}
	ASQ(globalObj.id)
		.then(_userService.getById)
		.then(function (done, result) {
			if (!result.user) {
				done.fail(new FailureResponse(404, _constants.messages.USER_NOT_FOUND));
			} else {
				done(globalObj);
			}
		})
		.then(_userService.activateDeactivate)
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.USER_DEACTIVATED_SUCCESS);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

// Get User by provide Id
exports.getByProviderId = function (req, res) {
	ASQ(req.query.providerId)
		.then(_userService.getByUserName)
		.then(function (_, result) {
			if (!result.user) {
				done.fail(new FailureResponse(404, _constants.messages.USER_NOT_FOUND));
			} else {
				return _helpers.responseType.Ok(res, result);
			}
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

// Send password reset link to user if they forgot password
exports.sendResetPasswordLink = function (req, res) {
	var globalObj = { username: req.body.username };
	ASQ(globalObj.username)
		.then(_userService.getByUserName)
		.then(function (done, result) {
			if (!result.user) {
				done.fail(new FailureResponse(404, _constants.messages.USER_NOT_FOUND));
			} else {
				var passResetObj = _siteHelpers.getPasswordResetLink(globalObj.username);
				var objToSave = { userId: result.user._id, token: passResetObj.token };

				// Assign to globale obj
				globalObj.user = result.user;
				globalObj.passResetObj = passResetObj;

				done(objToSave);
			}
		})
		.then(_passwordResetService.createNew)
		.then(function (_, result) {
			_emailSendingService.sendPasswordResetLinkEmail(globalObj.user, globalObj.passResetObj.link);
			return _helpers.responseType.Success(res, _constants.messages.PASSWORD_RESET_LINK_SENT);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });

}

// Reset user password after checking token
exports.updateNewPassword = function (req, res) {
	var globalObj = { token: req.body.token };
	ASQ(globalObj.token)
		.then(_passwordResetService.getByToken)
		.then(function (done, result) {
			if (!result.passwordReset) {
				done.fail(new FailureResponse(404, _constants.messages.INVALID_OR_EXPIRED_TOKEN));
			} else {

				var salt = _siteHelpers.createSalt();
				var fieldsToUpdate = {
					salt: salt,
					password: _siteHelpers.computeHash(req.body.password, salt)
				};

				var obj = {
					id: result.passwordReset.userId,
					fieldsToUpdate: fieldsToUpdate
				}

				// Assign things to global obj which are used later in next THEN functions
				globalObj.passwordReset = result.passwordReset;

				done(obj);
			}
		})
		.then(_userService.update)
		.then(function (done, result) {
			done(globalObj.passwordReset._id)
		})
		.then(_passwordResetService.delete)
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.PASSWORD_UPDATED_SUCCESS);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

// verify user email
exports.verifyEmail = function (req, res) {
	var token = req.body.token;
	ASQ(token)
		.then(_userService.getByToken)
		.then(function (done, result) {
			if (!result.user) {
				done.fail(new FailureResponse(404, _constants.messages.INVALID_OR_EXPIRED_TOKEN));
			} else {
				done(result.user._id);
			}
		})
		.then(_userService.verify)
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.EMAIL_VERIFICATION_SUCCESS);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

exports.uploadImage = function (req, res) {

	var globalObj = {
		id: req.body.userId,
		imageType: req.body.type
	}

	ASQ(req)
		.then(_fileUploadService.upload)
		.then(function (done, result) {

			// Set result to global variable
			globalObj.result = result;

			// If image type is profile pic then update user pic
			if (globalObj.imageType === _constants.ImageTypes.PROFILE) {
				_updateProfilePic(done, globalObj)
			}
			// If image type if ADHAR or PAN_CARD then update user info 
			else {
				const _sender = { id: req.user._id, name: _constants.GetNameToSave(req) };
				_sendNotification(_sender);
				_updateUserInfoImages(done, globalObj);
			}
		})
		.then(function (_, result) {
			return _helpers.responseType.Ok(res, { url: globalObj.result.displayUrl });
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

function _updateProfilePic(done, obj) {

	var globalObj = obj;
	ASQ(globalObj.id)
		.then(_userService.getById)
		.then(function (done, result) {
			if (!result.user) {
				done.fail(new FailureResponse(404, _constants.messages.USER_NOT_FOUND));
			} else {
				var fieldsToUpdate = {
					pic: globalObj.result.displayUrl
				};
				var obj = {
					id: globalObj.id,
					fieldsToUpdate: fieldsToUpdate
				}

				done(obj);
			}
		})
		.then(_userService.update)
		.pipe(done)
}

function _updateUserInfoImages(done, obj) {
	var globalObj = obj;
	ASQ(globalObj.id)
		.then(_userInfoService.getByUserId)
		.then(function (done, result) {

			var fieldsToUpdate = { userId: globalObj.id };
			if (globalObj.imageType === _constants.ImageTypes.ADHAR) {
				fieldsToUpdate['adhar.url'] = globalObj.result.displayUrl;
				fieldsToUpdate['adhar.isVerified'] = false;
			}
			if (globalObj.imageType === _constants.ImageTypes.PAN_CARD) {
				fieldsToUpdate['pan.url'] = globalObj.result.displayUrl;
				fieldsToUpdate['pan.isVerified'] = false;
			}
			if (result.userInfo) {
				var obj = {
					userInfoId: result.userInfo.id,
					fieldsToUpdate: fieldsToUpdate
				}
				ASQ(obj)
					.then(_userInfoService.update)
					.pipe(done);
			}
			else {
				ASQ(fieldsToUpdate)
					.then(_userInfoService.create)
					.pipe(done);
			}
		})
		.pipe(done);
}


// PRIVATE USE ONLY
function _sendNotification(sender) {
	var _obj = {
		sender: sender,
		type: _constants.NotificationTypes.ImageUploaded,
		url: '#/user/' + sender.id
	}

	ASQ(_obj)
		.then(_notificationService.create)
		.then(function (_, result) {

		})
}
