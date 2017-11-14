var _paymentInfoService = require('../core/dal/PaymentInfoService'),
	FailureResponse = require('../core/dto/FailureResponse'),
	_loggerService = require('../core/dal/ErrorLoggerService'),
	_constants = require('../utility/constants'),
	ASQ = require("asynquence"),
	_helpers = require('../utility/responseHelper'),
	_siteHelpers = require('../utility/siteHelpers');

exports.getAll = function (req, res) {
	ASQ(req.query)
		.then(_paymentInfoService.getAll)
		.then(function (_, list) {
			res.send(list);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });

};

// Get all payments count
exports.getAllPaymentHistoriesCount = function (req, res) {
	ASQ(req.query)
		.then(_paymentInfoService.getAllCount)
		.then(function (_, data) {
			return _helpers.responseType.Ok(res, data);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

// Create new payment
exports.create = function (req, res) {
	var paymentData = req.body;

	// if current user is logged in as Admin then change status directly to Accepted
	if (req.user.roles.indexOf(_constants.RoleTypes.Admin) > -1) {
		paymentData.status = _constants.StatusTypes.Accepted
	}

	paymentData.endDate = _siteHelpers.getPackageEndDate();
	paymentData.createdBy = req.user._id;
	paymentData.updatedBy = req.user._id;

	ASQ(paymentData)
		.then(_paymentInfoService.createNew)
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.PAYMENT_CREATED_SUCCESSFULLY);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
};

// Update payment Info
exports.update = function (req, res) {
	ASQ(req.body.id)
		.then(_paymentInfoService.getById)
		.then(function (done, result) {
			if (!result.paymentInfo) {
				done.fail(new FailureResponse(404, "No found"));
			} else {
				var fieldsToUpdate = {
					status: req.body.status,
					updated: new Date(),
					updatedBy: req.user._id
				};

				var obj = {
					paymentInfoId: req.body.id,
					fieldsToUpdate: fieldsToUpdate
				}

				done(obj);
			}
		})
		.then(_paymentInfoService.update)
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.PAYMENT_UPDATED_SUCCESS);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}
