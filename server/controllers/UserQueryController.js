var _userQuryService = require('../core/dal/UserQueryService'),
	_helpers = require('../utility/responseHelper'),
	_loggerService = require('../core/dal/ErrorLoggerService'),
	ASQ = require("asynquence");


exports.getAll = function (req, res) {
	ASQ()
		.then(_userQuryService.getAll)
		.then(function (_, list) {
			res.send(list);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
};


// Create new payment
exports.create = function (req, res) {
	var userQuery = req.body;

	ASQ(userQuery)
		.then(_userQuryService.createNew)
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.QUERY_SUBMITTED_SUCCESS);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
};