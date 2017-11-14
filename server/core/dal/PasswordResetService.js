var PasswordReset = require('../../models/PasswordReset').PasswordReset;

module.exports = {
	createNew  : _create,
	getById : _getById,
    delete : _delete,
    getByToken : _getByToken
}


//---------------------------------
// private functions
//---------------------------------

function _getById(done, id ) {
    _getSingleUserBy(done, { _id : id });
}

function _create(done, obj) {
	PasswordReset.create(obj, function (err, data) {
		if (err) {
			done.fail(err);
		}
		else {
			done({ passwordReset : data });
		}
	});
}

function _delete(done, id){
	PasswordReset.findByIdAndRemove(id, function (err, todo) {  
        if(err){
            done.fail(err);
        } else { 
           done(true);
        }
    });	
}

function _getByToken(done, token) {
    _getSingleUserBy(done, { token : token } )
}

function _getSingleUserBy(done, filter) {
    PasswordReset.findOne(filter, function (err, data) {
		if(err) {
            done.fail(err);
        }
		else {
			done({ passwordReset : data });
		}
	});
}