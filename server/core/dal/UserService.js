var User = require('../../models/User').User;

module.exports = {
    getAll : _getAll,
    getRecentlyAddedUser : _getRecentlyAddedUser,
    getActiveUsers : _getActiveUsers,
	getAllCount : _getAllCount,
	createNew  : _create,
	update : _update,
	getById : _getById,
    delete : _delete,
    activateDeactivate : _activateDeactivate,
    verify : _verify,
    getByUserName : _getByUserName,
    getByToken : _getByToken
}


//---------------------------------
// private functions
//---------------------------------

function _getAll(done, queryStringParams){
    var result = _setFilter(queryStringParams);
    User.find(result.filters)
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

function _getRecentlyAddedUser(done, queryStringParams){
    var result = _setFilter(queryStringParams);
    User.find(result.filters)
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

function _getActiveUsers(done) {
    _getAll(done, { activeUsers : true });
}

function _getAllCount(done, queryStringParams){
    var result = _setFilter(queryStringParams);
    User.count(result.filters, function(err, count){
		if(err){
			done.fail(err);
		} else {
			done({ count : count });
		}
    });
}

function _getById(done, id ) {
    _getSingleUserBy(done, { _id : id });
}

function _create(done, obj) {
	User.create(obj, function (err, data) {
		if (err) {
			done.fail(err);
		}
		else {
			done({ user : data });
		}
	});
}

function _update(done, obj) {
	User.findByIdAndUpdate(obj.id, { $set: obj.fieldsToUpdate }, function (err, data) {
		if(err){
			done.fail(err);
		}
		else { 
			done({ user : data });
		}
	});	
}

function _delete(done, id){
	User.findByIdAndRemove(id, function (err, todo) {  
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

    // Filter for keyword entered
    if(queryStringParams.q){
        var regex = new RegExp('.*' + queryStringParams.q ? queryStringParams.q : '' + '.*');
        findBy.push( { $or: [ 
                                { 'firstName': regex }, 
                                { 'lastName': regex }, 
                                { 'nickName': regex }, 
                                { 'username': queryStringParams.q } 
                            ] 
                    });
    }

    if(queryStringParams.uType === 'admin' ){
        findBy.push({ roles: { $in: ['admin'] } });
        findBy.push({ isSubAdmin : true });
    }else{
        findBy.push({ roles: { $nin: ['admin'] } });
    }

    // Filter for language
    if(queryStringParams.registerType){
        if(queryStringParams.registerType === 'website'){
            findBy.push({ 'provider': { $nin: ['facebook'] } });
        }else{
            findBy.push({ 'provider': queryStringParams.registerType });
        }
    }

    // Add Referral types
    if(queryStringParams.referredBy){
        findBy.push({ 'referredBy': queryStringParams.referredBy });
    }

    // Only active users
    if(queryStringParams.activeUsers){
        findBy.push({ 'isActive': true });
        findBy.push({ 'isVerified': true });        
    }

    if(findBy.length){
        result.filters = { $and: findBy };
    }  

    return result;
}

function _activateDeactivate(done, data) {
    var obj = { 
                id :  data.id, 
                fieldsToUpdate : { isActive : data.status } 
             };
    _update(done, obj);
}

function _verify(done, id) {
    var obj = { 
                id : id, 
                fieldsToUpdate : { isVerified : true } 
             };
    _update(done, obj);
}

function _getByUserName(done, providerId) {
    _getSingleUserBy(done, { username : providerId } )
}

function _getByToken(done, token){
    _getSingleUserBy(done, { password : token } )
}

function _getSingleUserBy(done, filter) {
    User.findOne(filter, function (err, data) {
		if(err) {
            done.fail(err);
        }
		else {
			done({ user : data });
		}
	});
}