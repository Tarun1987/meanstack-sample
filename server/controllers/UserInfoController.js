var _userInfoService = require('../core/dal/UserInfoService'),
	FailureRespose = require('../core/dto/FailureResponse'),
	_loggerService = require('../core/dal/ErrorLoggerService'),
	ASQ = require("asynquence"),
	_helpers = require('../utility/responseHelper');


exports.getByUserId = function (req, res) {
	ASQ(req.query.userId)
		.then(_userInfoService.getByUserId)
		.then(function (_, result) {
			return _helpers.responseType.Ok(res, result);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

// Update user info details
exports.updateUserInfo = function (req, res) {
	ASQ(req.body.id)
		.then(_userInfoService.getById)
		.then(function (done, result) {
			if (!result.userInfo) {
				done.fail(new FailureRespose(404, "File not found"))
			} else {
				var fieldsToUpdate = {};
				switch (req.body.fileType) {
					case 'PAN':
						fieldsToUpdate['pan.isVerified'] = req.body.status;
						break;
					case 'ADHAR':
						fieldsToUpdate['adhar.isVerified'] = req.body.status;
						break;
				}

				var obj = {
					userInfoId: req.body.id,
					fieldsToUpdate: fieldsToUpdate
				};

				// GET ALL fileds to update
				done(obj)
			}
		})
		.then(_userInfoService.update)
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.USERINFO_UPDATE_SUCCESS);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}