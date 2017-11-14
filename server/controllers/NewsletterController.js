var _newLetterService = require('../core/dal/MailBodyService'),
    _userService = require('../core/dal/UserService'),
    _emailSendingService = require('../core/dal/EmailSenderService'),
    _loggerService = require('../core/dal/ErrorLoggerService'),
    ASQ = require("asynquence"),
    _helpers = require('../utility/responseHelper'),
    FailureResponse = require('../core/dto/FailureResponse'),
    _constants = require('../utility/constants');

// GET All Setting
exports.getAll = function (req, res) {
    ASQ()
        .then(_newLetterService.getAllNewsLetters)
        .then(function (_, list) {
            res.send(list);
        })
        .onerror(function (err) { _loggerService.handleError(err, res) });

};

// Send News Letter
exports.sendNewsLetter = function (req, res) {
    ASQ()
        .then(_userService.getActiveUsers)
        .then(function (done, users) {
            if (users.length <= 0) {
                done.fail(new FailureResponse(404, _constants.messages.NO_ACTIVE_USERS_FOUND));
            } else {
                for (var i = 0; i < users.length; i++) {
                    _emailSendingService.sendNewsLetter(users[i], req.body.id);
                }
                done(true);
            }
        })
        .then(function (_, result) {
            return _helpers.responseType.Success(res, _constants.messages.NEWSLETTER_SENT);
        })
        .onerror(function (err) { _loggerService.handleError(err, res) });
};