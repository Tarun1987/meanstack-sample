var _settingService = require('../core/dal/SettingService'),
    _userService = require('../core/dal/UserService'),
    _urlService = require('../core/dal/UrlDetailService'),
    _paymentService = require('../core/dal/PaymentInfoService'),
    ASQ = require("asynquence"),
    FailureResponse = require('../core/dto/FailureResponse'),
    _constants = require('../utility/constants'),
    _loggerService = require('../core/dal/ErrorLoggerService'),
    _helpers = require('../utility/responseHelper');


// GET Quick Stats to display on Dashboard
exports.getQuickStats = function (req, res) {
    ASQ({})
        .gate(_userService.getAllCount, _paymentService.getAllCount, _urlService.getAllCount, _urlService.getAllCount)
        .then(function (_, userCountObj, paymentCountObj, urlCountObj, pendigItemCountObj) {
            let count = { count: 0 };
            var obj = {
                user: userCountObj ? userCountObj : count,
                payment: paymentCountObj ? paymentCountObj : count,
                url: urlCountObj ? urlCountObj : count,
                pendingItem: urlCountObj ? urlCountObj : count
            };
            return _helpers.responseType.Ok(res, obj);
        });
};