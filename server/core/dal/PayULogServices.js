var PayULog = require('../../models/PayULog').PayULog,
    _constants = require('../../utility/constants');

module.exports= {
    logDetailsSentToPayU : _saveRequest,
    logDetailComingFromPayU : _saveResponse,
    getFailureDetailByUserId : _getFailureDetailByUserId
}

function _saveRequest(data) {
    data.type = _constants.PayULogType.REQUEST;
    _create(data);
}

function _saveResponse(data) {
    data.type = _constants.PayULogType.RESPONSE;
    _create(data);
}


// Only create log don;t send any response
function _create(obj) {
    obj.detail = JSON.stringify(obj.detail);
    PayULog.create(obj);
}

function _getFailureDetailByUserId(done, userId){
    var _filters = { userId : userId };
    PayULog.findOne(_filters)
           .sort({ created: -1 })
           .exec(function (err, data) {
                if(err) {
                    done.fail(err);
                }
                else {
                    done({ payULog : data });
                }
            });
}