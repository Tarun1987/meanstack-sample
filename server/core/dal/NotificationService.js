const Notification = require('../../models/Notification').Notification;

module.exports = {
    create: _create,
    getAll: _getAll,
    getAllCount: _getAllCount
}


function _getAll(done, _filters) {
    Notification.find(_filters.query)
        .sort(_filters.sort)
        .skip(_filters.skip)
        .limit(_filters.limit)
        .exec(function (err, collection) {
            if (err) {
                done.fail(err);
            } else {
                done(collection);
            }
        });
}

function _getAllCount(done, _filters) {
    Notification.count(_filters.query)
        .exec(function (err, count) {
            if (err) {
                done.fail(err);
            } else {
                done(count);
            }
        });
}


function _create(done, obj) {
    Notification.create(obj, function (err, data) {
        if (err) {
            done.fail(err);
        }
        else {
            done({ data: data });
        }
    });
}