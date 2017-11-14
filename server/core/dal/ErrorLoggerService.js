module.exports = {
    handleError : _handleError
}


function _handleError(err, res){
    var _status = 400;
    var _message = "Oops something went wrong!!";

    if(err && err.status) {
        _status = err.status;
    }
    if(err && (err.message || err.reason)) {
        _message = err.status || err.reason;
    }

	res.status(_status);		
	return res.send({ message : _message });
}