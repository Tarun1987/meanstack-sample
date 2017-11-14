const payu = require("pay-u").newOrder;
var ASQ = require('asynquence'),
    _packageService = require('../core/dal/PackageService'),
    _payULogService = require('../core/dal/PayULogServices'),
    _paymentInfoService = require('../core/dal/PaymentInfoService'),
    _loggerService = require('../core/dal/ErrorLoggerService'),
    _constants = require('../utility/constants'),
    _helpers = require('../utility/responseHelper'),
    _siteHelpers = require('../utility/siteHelpers');

// Add new Setting
exports.create = function (req, res) {

    var globalObj = {
        packageId: req.body.packageId,
        description: req.body.description,
        phone: req.body.phone,
        user: req.user
    }
    ASQ(globalObj.packageId)
        .then(_packageService.getById)
        .then(function (done, result) {
            if (result.package) {

                // SET Package to globalObj
                globalObj.package = result.package;

                // GET object to send to PayU
                var payUObj = _getPayUObject(globalObj);

                // Create PayU Obj
                payu.Create(payUObj, false);

                // Send To PayU
                payu.sendReq().then(url => {
                    res.redirect(url);
                })
                    .catch(err => {
                        res.send(err);
                    });

            } else {
                // package not found
                var url = _siteHelpers.getPaymentUrl() + "?pnf=true";
                res.redirect(url);
            }
        })
        .onerror(function (err) { _loggerService.handleError(err, res) });

};

// Payu Success callback handler
exports.payuSuccess = function (req, res) {

    var globalObj = {
        user: req.user,
        detail: req.body
    }

    var paymentData = {
        userId: globalObj.user._id,
        packageId: globalObj.detail.udf1,
        status: _constants.StatusTypes.Accepted,
        description: globalObj.detail.udf1,
        mode: _constants.PaymentModes.Online,
        endDate: _siteHelpers.getPackageEndDate(),
        createdBy: globalObj.user._id,
        updatedBy: globalObj.user._id
    }

    ASQ(paymentData)
        .then(_paymentInfoService.createNew)
        .then(function (done, result) {
            var logObj = {
                userId: globalObj.user._id,
                detail: globalObj.detail
            }
            // Log response to DB
            _payULogService.logDetailComingFromPayU(logObj);
            res.redirect(_siteHelpers.getPaymentResponseUrl(true));
        })
        .onerror(function (err) { _loggerService.handleError(err, res) });
};

// Payu Failure callback handler
exports.payuFailure = function (req, res) {

    var logObj = {
        userId: req.user._id,
        detail: req.body
    }
    // Log failure response to DB
    _payULogService.logDetailComingFromPayU(logObj);
    res.redirect(_siteHelpers.getPaymentResponseUrl(false));
};


exports.getPaymentFailureDetail = function (req, res) {
    var userId = req.query.userId;
    ASQ(userId)
        .then(_payULogService.getFailureDetailByUserId)
        .then(function (done, result) {
            return _helpers.responseType.Ok(res, result);
        })
        .onerror(function (err) { _loggerService.handleError(err, res) });
}



function _getPayUObject(_obj) {

    var _payUObj = {
        amount: _obj.package.price,
        productinfo: _obj.package.description,
        firstname: _obj.user.firstName,
        email: _obj.user.username,
        phone: _obj.phone,
        surl: _siteHelpers.getPayUSuccessUrl(),
        furl: _siteHelpers.getPayUFailureUrl(),
        service_provider: process.env.PAYU_PROVIDER,
        key: process.env.PAYU_KEY,
        salt: process.env.PAYU_SALT,
        url: process.env.PAYU_URL,
        udf1: _obj.packageId,
        udf2: _obj.description
    };

    var logObj = {
        userId: _obj.user._id,
        detail: _payUObj
    }
    _payULogService.logDetailsSentToPayU(logObj);

    return _payUObj;
}