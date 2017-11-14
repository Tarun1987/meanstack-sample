var MailSent = require('../../models/MailSent').MailSent;

module.exports = {
    getAll : _getAll,
    getById : _getById
}


//---------------------------------
// private functions
//---------------------------------

function _getById(done, id ) {
    var _filters = { _id : id };
    MailSent.findOne(_filters, function (err, email) {
		if(err) {
            done.fail(err);
        }
		else {
			done({ email : email });
		}
	});
}


function _getAll(done){
    //TODO :: Later filters will be passed a parameters
    var _filters = {};
    MailSent.find(_filters).exec(function (err, collection) { 
		if(err){
            done.fail(err);
        }else {
            done(collection);
        }
	});
}