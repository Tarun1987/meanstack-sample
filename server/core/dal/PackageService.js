var Package = require('../../models/Package').Package;

module.exports = {
    getAll : _getAll,
    getById : _getById,
    getPopularPackages: _getPopularPackages,
};


//---------------------------------
// private functions
//---------------------------------

function _getAll(done, queryStringParams){
    //TODO :: Later filters will be passed a parameters
    var _filters = {};
    Package.find(_filters)
        .limit(queryStringParams.limit)
        .exec(function (err, collection) { 
            if(err){
                done.fail(err);
            } else {
                done(collection);
            }
        });
}

function _getPopularPackages(done){
    var _filters = {};
    Package.find(_filters).exec(function (err, collection) { 
		if(err){
            done.fail(err);
        } else {
            done(collection);
        }
	});
}


function _getById(done, id ) {
    var _filters = { _id : id };
    Package.findOne(_filters, function (err, data) {
		if(err) {
            done.fail(err);
        }
		else {
			done({ package : data });
		}
	});
}