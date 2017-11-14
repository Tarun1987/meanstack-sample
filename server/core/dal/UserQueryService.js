var UserQuery = require('../../models/UserQuery').UserQuery;

module.exports = {
    getAll: _getAll,
    createNew : _create
};


//---------------------------------
// private functions
//---------------------------------

function _getAll(done, queryStringParams){
    var _filters = {};
    UserQuery.find(_filters)
        .exec(function (err, collection) { 
            if(err){
                done.fail(err);
            } else {
                done(collection);
            }
        });
}


function _create(done, obj) {
	UserQuery.create(obj, function (err, data) {
		if (err) {
			done.fail(err);
		}
		else {
			done({ userQuery : data });
		}
	});
}