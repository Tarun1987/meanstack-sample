var UserInfo = require('../../models/UserInfo').UserInfo;

module.exports = {
    getById : _getById,
    getByUserId : _getByUserId,
    update : _update,
    create : _create,
    getAllWithAllImages : _getAllWithAllImages
}


//---------------------------------
// private functions
//---------------------------------

function _getAllWithAllImages(done, data){
    var filters = [ 
                    { 'adhar.isVerified' : true },
                    { 'pan.isVerified' : true },
                    { 'cheque.isVerified' : true }
                  ];
    if(data.activePaymentUsers) {
        filters.push({ $in : { 'userId' : data.activePaymentUsers  } })
    }

     UserInfo.find(filters)
        .exec(function (err, collection) {  
            if(err){
                done.fail(err);
            } else {
                done(collection);
            }
	});


}


function _getById(done, id ){
    var _filters = { _id : id };
    _getUserInfo(done, _filters);
}

function _getByUserId(done, userId ){
    var _filters = { userId : userId };
    _getUserInfo(done, _filters);
}

function _create(done, obj) {
	UserInfo.create(obj, function (err, data) {
		if (err) {
			done.fail(err);
		}
		else {
			done({ userInfo : data });
		}
	});
}

function _update(done, obj) {
    UserInfo.findByIdAndUpdate(obj.userInfoId, { $set: obj.fieldsToUpdate }, function (err, data) {
        if(err){
            done.fail(err);
        }
        else { 
            done(data);
        }
    });
}


function _getUserInfo(done, filters){
    UserInfo.findOne(filters, function (err, data) {
        if(err) { 
            done.fail(err);
        }
        else { 
           done({ userInfo : data });
        }
    });
}