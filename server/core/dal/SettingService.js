var Setting = require('../../models/Setting').Setting;

module.exports = {
    getAll : _getAll,
	getAllCount : _getAllCount,
	createNew  : _create,
	update : _update,
	getById : _getById,
	delete : _delete
}


//---------------------------------
// private functions
//---------------------------------

function _getAll(done, queryStringParams){
    var result = _setFilter(queryStringParams);
    Setting.find(result.filters)
			   .sort(result.orderby)
			   .skip(result.skip)
			   .limit(result.limit)
               .exec(function (err, collection) {  
                    if(err){
                        done.fail(err);
                    } else {
                        done(collection);
                    }
	});
}

function _getAllCount(done, queryStringParams){
    var result = _setFilter(queryStringParams);
    Setting.count(result.filters, function(err, count){
		if(err){
			done.fail(err);
		} else {
			done({ count : count });
		}
    });
}

function _getById(done, id ) {
    var _filters = { _id : id };
    Setting.findOne(_filters, function (err, data) {
		if(err) {
            done.fail(err);
        }
		else {
			done({ setting : data });
		}
	});
}

function _create(done, obj) {
	Setting.create(obj, function (err, data) {
		if (err) {
			done.fail(err);
		}
		else {
			done({ setting : data });
		}
	});
}

function _update(done, obj) {
	Setting.findByIdAndUpdate(obj.id, { $set: obj.fieldsToUpdate }, function (err, data) {
		if(err){
			done.fail(err);
		}
		else { 
			done({ setting : data });
		}
	});	
}

function _delete(done, id){
	Setting.findByIdAndRemove(id, function (err, todo) {  
        if(err){
            done.fail(err);
        } else { 
           done(true);
        }
    });	
}

function _setFilter(queryStringParams) {

	var result = { limit : 1000000, skip : 0, orderby :  { created: -1 }, filters : {} };
	var findBy = [];

	// Set the limit to get records
	if(queryStringParams.limit) 
		result.limit = Number(queryStringParams.limit);

	// Set the skip for pagination
	if(queryStringParams.skip)
		result.skip = Number(queryStringParams.skip);

	
	if(findBy.length){
		result.filters = { $and: findBy };
	}  
	
	return result;
}