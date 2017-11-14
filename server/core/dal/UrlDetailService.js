var UrlDetail = require('../../models/UrlDetail').UrlDetail;

module.exports = {
    getAll : _getAll,
	getAllCount : _getAllCount,
	createNew  : _create,
	update : _update,
	getById : _getById,
    delete : _delete,
    getByLink : _getByLink
 }


//---------------------------------
// private functions
//---------------------------------

function _getAll(done, queryStringParams){
    var result = _setFilter(queryStringParams);
    UrlDetail.find(result.filters)
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
    UrlDetail.count(result.filters, function(err, count){
		if(err){
			done.fail(err);
		} else {
			done({ count : count });
		}
    });
}

function _getById(done, id ) {
    _getSingle(done, { _id : id })
}

function _getByLink(done, link ) {
    _getSingle(done, { link : link })
}

function _create(done, obj) {
	UrlDetail.create(obj, function (err, data) {
		if (err) {
			done.fail(err);
		}
		else {
			done({ urlDetail : data });
		}
	});
}

function _update(done, obj) {
	UrlDetail.findByIdAndUpdate(obj.id, { $set: obj.fieldsToUpdate }, function (err, data) {
		if(err){
			done.fail(err);
		}
		else { 
			done({ urlDetail : data });
		}
	});	
}

function _delete(done, id){
	UrlDetail.findByIdAndRemove(id, function (err, todo) {  
        if(err){
            done.fail(err);
        } else { 
           done(true);
        }
    });	
}

function _getSingle(done, filters){
    UrlDetail.findOne(filters, function (err, data) {
		if(err) {
            done.fail(err);
        }
		else {
			done({ urlDetail : data });
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