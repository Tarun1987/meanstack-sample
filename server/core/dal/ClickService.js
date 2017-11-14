var AvailableClick = require('../../models/AvailableClick').AvailableClick;

module.exports = {
    getAll : _getAll,
    getAllByUserId : _getAllByUserId,
    _getById : _getById,
    create : _create,
    setLinkVisited : _setLinkVisited
}


function _getById(done, id ) {
    var _filters = { _id : id };
    AvailableClick.findOne(_filters, function (err, data) {
		if(err) {
            done.fail(err);
        }
		else {
			done({ availableClick : data });
		}
	});
}

function _getAllByUserId(done, userId){
    var queryStringParams = { assignedTo : userId };
    _getAll(done, queryStringParams);
}

function _getAll(done, queryStringParams){
    var _filters = {};
    if(queryStringParams.userId){
        _filters.assignedTo = queryStringParams.userId;
    }
    if(queryStringParams.isClicked != null && queryStringParams.isClicked != ""){
        _filters.isClicked = queryStringParams.isClicked;
    }
    AvailableClick.find(_filters).exec(function (err, collection) { 
		if(err){
            done.fail(err);
        }else {
            done(collection);
        }
	});
}

function _create(done, obj) {
	AvailableClick.create(obj, function (err, data) {
		if (err) {
			done.fail(err);
		}
		else {
			done({ user : data });
		}
	});
}

function _setLinkVisited(done, availableClickId){
    var fieldsToUpdate = { isClicked : true, clickDate : new Date() };
    AvailableClick.findByIdAndUpdate(availableClickId, { $set: fieldsToUpdate }, function (err, data) {
		if(err){
			done.fail(err);
		}
		else { 
			done({ user : data });
		}
	});	
}