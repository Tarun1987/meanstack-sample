var PaymentInfo = require('../../models/PaymentInfo').PaymentInfo,
	_dateHelper = require('../../utility/date')
	_constants = require('../../utility/constants');

module.exports = {
    getAll : _getAll,
	getAllCount : _getAllCount,
	createNew  : _create,
	update : _update,
	getById : _getById,
	getActivePaymentUsers : _getActivePaymentUsers
}


//---------------------------------
// private functions
//---------------------------------

function _getAll(done, queryStringParams){
    var result = _setUserSearchFilter(queryStringParams);
    PaymentInfo.find(result.filters)
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
    var result = _setUserSearchFilter(queryStringParams);
    PaymentInfo.count(result.filters, function(err, count){
		if(err){
			done.fail(err);
		} else {
			done({ count : count });
		}
    });
}

function _getActivePaymentUsers(done){
	var obj = { 
		status : _constants.StatusTypes.Completed
	 };
	 
	 _getAll(done, obj);
}

function _getById(done, id ) {
    var _filters = { _id : id };
    PaymentInfo.findOne(_filters, function (err, data) {
		if(err) {
            done.fail(err);
        }
		else {
			done({ paymentInfo : data });
		}
	});
}

function _create(done, obj) {
	PaymentInfo.create(obj, function (err, data) {
		if (err) {
			done.fail(err);
		}
		else {
			done({ paymentInfo : data });
		}
	});
}

function _update(done, obj) {
	PaymentInfo.findByIdAndUpdate(obj.paymentInfoId, { $set: obj.fieldsToUpdate }, function (err, data) {
		if(err){
			done.fail(err);
		}
		else { 
			done({ paymentInfo : data });
		}
	});	
}


function _setUserSearchFilter(queryStringParams) {
	
		var result = { limit : 1000000, skip : 0, orderby :  { created: -1 }, filters : {} };
		var findBy = [];
	
		// Set the limit to get records
		if(queryStringParams.limit) 
			result.limit = Number(queryStringParams.limit);
	
		// Set the skip for pagination
		if(queryStringParams.skip)
			result.skip = Number(queryStringParams.skip);

		// Add User
		if(queryStringParams.uId){
			findBy.push({ 'userId': queryStringParams.uId });
		}

		// Payment mode
		if(queryStringParams.mode){
			findBy.push({ 'mode': queryStringParams.mode });
		}

		// If Start date and end date are passed
		if (queryStringParams.sdt && queryStringParams.edt) {
			var _startDate = _dateHelper.convertDate(queryStringParams.sdt);
			var _endDate = _dateHelper.convertDate(queryStringParams.edt);
	
			var $strtCondn = {$and: [{startDate: {'$gte': _startDate, '$lt': _endDate}}]};
			var $endCondn = {$and: [{endDate: {'$gte': _startDate, '$lt': _endDate}}]};
	
			findBy.push({$or: [$endCondn, $strtCondn]});
		}
		

		// Only current month
		if(queryStringParams.currentMonthActivePayment === "true"){
			findBy.push({ "startDate": { "$lt": new Date() } });
			findBy.push({ "endDate": { "$gte": new Date() } });
			findBy.push({ $or:[{'status': _constants.StatusTypes.Accepted }, {'status': _constants.StatusTypes.Completed }]});
		
		} else {
			// Add Payment staus 
			if(queryStringParams.status){
				findBy.push({ 'status': queryStringParams.status });
			}
		}
	
		if(findBy.length){
			result.filters = { $and: findBy };
		}  
	
	  return result;
			
	}


