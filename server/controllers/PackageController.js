var _packageService = require('../core/dal/PackageService'),
    _loggerService = require('../core/dal/ErrorLoggerService'),
    ASQ = require("asynquence");


exports.getAll = function (req, res) {
    ASQ({})
        .then(_packageService.getAll)
        .then(function (_, list) {
            res.send(list);
        })
        .onerror(function (err) { _loggerService.handleError(err, res) });
};

exports.getPopularPackages = function (req, res) {
    ASQ({ limit: 5 })
        .then(_packageService.getPopularPackages)
        .then(function (_, list) {
            res.send(list);
        })
        .onerror(function (err) { _loggerService.handleError(err, res) });
}
