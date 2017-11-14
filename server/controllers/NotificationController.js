const _notificationService = require('../core/dal/NotificationService'),
    _loggerService = require('../core/dal/ErrorLoggerService'),
    _constants = require('../utility/constants'),
    ASQ = require('asynquence');

module.exports = {
    getAll: _getAll,
    getAllCount: _getAllCount
}


// GET All users
function _getAll(req, res) {
    var filter = _setSearchFilter(req);
    ASQ(filter)
        .then(_notificationService.getAll)
        .then(function (_, list) {
            res.send(list);
        })
        .onerror(function (err) { _loggerService.handleError(err, res) });

};

// Count all new notifictions
function _getAllCount(req, res) {
    var filter = _setSearchFilter(req);
    ASQ(filter)
        .then(_notificationService.getAllCount)
        .then(function (_, count) {
            res.send(_constants.ResponseTypes.SUCCESS_DATA({ count: count }));
        })
        .onerror(function (err) { _loggerService.handleError(err, res) });
}


function _setSearchFilter(req) {

    var obj = req.query;
    var findBy = [];

    // show notications assigned to me only

    if (obj.userId)
        findBy.push({ receivers: obj.userId });

    if (obj.type) {
        findBy.push({ type: obj.type });

        // means get only active notifications
        if (obj.onlyActive) {
            if (obj.type === _constants.notificationTypes.Message) {
                findBy.push({ created: { "$gte": req.user.messageLastSeen } });
            } else if (obj.type === _constants.notificationTypes.All) {
                findBy.push({ created: { "$gte": req.user.notifyLastSeen } });
            }
        }
    }

    var _query = {}
    if (findBy.length) {
        _query = { $and: findBy };
    }

    var _filters = _constants.setLimitAndSkipAndFilters(req, _query);
    return _filters;

}