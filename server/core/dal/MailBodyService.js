var MailBody = require('../../models/MailBody').MailBody;

module.exports = {
    getAll : _getAll,
    getByCode : _getByCode,
    getById   : _getById,
    getAllNewsLetters : _getNewsLetters
}


//---------------------------------
// private functions
//---------------------------------

function _getById(done, id ) {
    var _filters = { _id : id };
    MailBody.findOne(_filters, function (err, data) {
		if(err) {
            done.fail(err);
        }
		else {
			done({ mailBody : data });
		}
	});
}

function _getByCode(done, code ) {
    var _filters = { code : code };
    MailBody.findOne(_filters, function (err, data) {
		if(err) {
            done.fail(err);
        }
		else {
			done({ mailBody : data });
		}
	});
}

function _getNewsLetters(done, code){
    _getAll(done, { code : 'NL' });
}

function _getAll(done, queryStringParams){
    var _filters = {};
    if(queryStringParams.code){
        _filters.code = queryStringParams.code;
    }
    MailBody.find(_filters).exec(function (err, collection) { 
		if(err){
            done.fail(err);
        }else {
            done(collection);
        }
	});
}