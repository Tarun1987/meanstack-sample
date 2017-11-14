var _urlDetailService = require('../core/dal/UrlDetailService'),
	_fileUploadService = require('../core/dal/FileUploadService'),
	_loggerService = require('../core/dal/ErrorLoggerService'),
	ASQ = require("asynquence"),
	_constants = require('../utility/constants'),
	_helpers = require('../utility/responseHelper');


// GET ALL URLS
exports.getAll = function (req, res) {
	ASQ(req.query)
		.then(_urlDetailService.getAll)
		.then(function (_, list) {
			res.send(list);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
};

// Get all count
exports.getAllCount = function (req, res) {
	ASQ(req.query)
		.then(_urlDetailService.getAllCount)
		.then(function (_, data) {
			return _helpers.responseType.Ok(res, data);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}

// Create new URL
exports.create = function (req, res) {
	var urlDetail = {
		link: req.body.link,
		createdBy: req.user.username
	};
	ASQ(urlDetail.link)
		.then(_urlDetailService.getByLink)
		.then(function (done, result) {
			if (result.urlDetail) {
				done.fail(new FailureResponse(404, _constants.messages.URL_ALREADY_EXISTS));
			} else {
				done(urlDetail);
			}
		})
		.then(_urlDetailService.createNew)
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.URL_CREATED_SUCCESS);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
};

// Delete all URLs
exports.remove = function (req, res) {
	var id = req.query.id;
	ASQ(id)
		.then(_urlDetailService.getById)
		.then(function (done, result) {
			if (!result.urlDetail) {
				done.fail(new FailureResponse(404, _constants.messages.URL_NOT_FOUND));
			} else {
				done(id);
			}
		})
		.then(_urlDetailService.delete)
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.URL_DELETED);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}


exports.uploadUrlsByFile = function (req, res) {

	ASQ(req)
		.then(_fileUploadService.uploadExcel)
		.then(function (done, linksToSave) {
			linksToSave.forEach(function (link) {

				var urlDetail = {
					link: link,
					createdBy: req.user.username
				};

				ASQ(urlDetail.link)
					.then(_urlDetailService.getByLink)
					.then(function (done, result) {
						if (result.urlDetail) {
							done.fail(new FailureResponse(404, _constants.messages.URL_ALREADY_EXISTS));
						} else {
							done(urlDetail);
						}
					})
					.then(_urlDetailService.createNew)
					.then(function (_, result) { })
					.or(function (err) { })

			});

			done(true);
		})
		.then(function (_, result) {
			return _helpers.responseType.Success(res, _constants.messages.LINKS_UPLOADED_SUCCESS);
		})
		.onerror(function (err) { _loggerService.handleError(err, res) });
}



