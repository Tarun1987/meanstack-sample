var _mailSentService = require('../core/dal/MailSentService'),
	_constants = require('../utility/constants'),
	_loggerService = require('../core/dal/ErrorLoggerService'),
	ASQ = require("asynquence"),
	_helpers = require('../utility/responseHelper');

exports.getById = function (req, res) {
	ASQ(req.params.id)
		.then(_mailSentService.getById)
		.then(function (_, result) {
			return _helpers.responseType.Ok(res, result);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

exports.getAll = function (req, res) {
	ASQ()
		.then(_mailSentService.getAll)
		.then(function (_, list) {
			res.send(list);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}
