var _settingService = require('../core/dal/SettingService'),
	ASQ = require("asynquence"),
	FailureResponse = require('../core/dto/FailureResponse'),
	_loggerService = require('../core/dal/ErrorLoggerService'),
	_loggerService = require('../core/dal/ErrorLoggerService'),
	_constants = require('../utility/constants'),
	_helpers = require('../utility/responseHelper');

// GET All Setting
exports.getAll = function (req, res) {
	ASQ(req.query)
		.then(_settingService.getAll)
		.then(function (_, list) {
			res.send(list);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
};

// Get all payments count
exports.getAllCount = function (req, res) {
	ASQ(req.query)
		.then(_settingService.getAllCount)
		.then(function (_, data) {
			return _helpers.responseType.Ok(res, data);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

// GET Single record by ID
exports.getById = function (req, res) {
	ASQ(req.query.id)
		.then(_settingService.getById)
		.then(function (_, result) {
			return _helpers.responseType.Ok(res, result);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

// Create new setting
exports.create = function (req, res) {
	var settingData = req.body;

	ASQ(settingData)
		.then(_settingService.createNew)
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.SETTING_CREATE_SUCCESS);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
};

// Update Setting
exports.update = function (req, res) {
	ASQ(req.body.id)
		.then(_settingService.getById)
		.then(function (done, result) {
			if (!result.setting) {
				done.fail(new FailureResponse(404, _constants.messages.SETTING_NOT_FOUND));
			} else {
				var fieldsToUpdate = {
					name: req.body.name,
					value: req.body.value,
					description: req.body.description,
					updated: new Date()
				};

				var obj = {
					id: req.body.id,
					fieldsToUpdate: fieldsToUpdate
				}

				done(obj);
			}
		})
		.then(_settingService.update)
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.SETTING_UPDATED_SUCCESS);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

// Delete Setting
exports.remove = function (req, res) {
	var id = req.query.id;
	ASQ(id)
		.then(_settingService.getById)
		.then(function (done, result) {
			if (!result.setting) {
				done.fail(new FailureResponse(404, _constants.messages.SETTING_NOT_FOUND));
			} else {
				done(id);
			}
		})
		.then(_settingService.delete)
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.SETTING_DELETED_SUCCESS);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

// Deactivate Setting
exports.deactivateSetting = function (req, res) {
	ASQ(req.body.settingId)
		.then(_settingService.getById)
		.then(function (done, result) {
			if (!result.setting) {
				done.fail(new FailureResponse(404, _constants.messages.SETTING_NOT_FOUND));
			} else {
				var fieldsToUpdate = { isActive: false };
				var obj = {
					id: req.body.settingId,
					fieldsToUpdate: fieldsToUpdate
				}
				done(obj);
			}
		})
		.then(_settingService.update)
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.SETTING_DEACTIVATION_SUCCESS);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}