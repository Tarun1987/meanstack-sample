var crypto = require('crypto');

module.exports = {
	createSalt : _createSalt,
	getExcelFileUploadUrl : _getExcelFileUploadUrl,
	getImageUploadAndDisplayUrl : _getImageUploadAndDisplayUrl,
	getBaseURL : _getBaseUrl,
	getPasswordResetLink : _getPasswordResetLink,
	getLoginURL: _getLoginURL,
	computeHash : _computeHash,
	getPayUSuccessUrl : _getPayUSuccessUrl,
	getPayUFailureUrl : _getPayUFailureUrl,
	getPaymentUrl : _getPaymentUrl,
	getPaymentResponseUrl : _getPaymentResponseUrl,
	getPackageEndDate : _getPackageEndDate
}

function _createSalt() {
	var length = 8;
	return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').substring(0, length);
};

function _getExcelFileUploadUrl(extension) {
	var length = 20;
	var date = new Date();
	var random = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').substring(0, length);
	var xFileName = random + '_'+ date.getDate() + date.getMonth() + date.getYear() +'.' + extension;
	
	return './public/uploaded/'+ xFileName;
};

function _getImageUploadAndDisplayUrl(extension) {
	var length = 20;
	var date = new Date();
	var random = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').substring(0, length);
	var imgName = random + '_'+ date.getDate() + date.getMonth() + date.getYear() +'.' + extension;
	
	return {
		uploadUrl : './public/uploaded/'+ imgName ,
		displayUrl : '/uploaded/' + imgName
	};
};

function _getBaseUrl() {
	return  _getURL();
}

function _getPasswordResetLink(userName) {
	var token = _computeHash(userName, 'shawnWL');
	var link = config.baseUrl + "resetpassword/" + token;
	return {
		token : token,
		link : link
	}
}

function _getLoginURL() {
	return _getURL("login");
}

function _computeHash(source, salt){
	var hmac = crypto.createHmac("sha1", salt);
	var hash = hmac.update(source);
	return hash.digest("hex");
}

function _getPayUSuccessUrl(){
	return _getURL('api/payuSuccess');
}

function _getPayUFailureUrl(){
	return _getURL('api/payuFailure');
}

function _getPaymentUrl(){
	return _getURL('add-payment');
}

function _getPaymentResponseUrl(isSuccess){
	var url = _getURL('payment-response');
	if(isSuccess){
		url += '?type=success';
	}else{
		url += '?type=failure';
	}
	return url;
}

function _getURL(url) {
	var _baseUrl = process.env.BASE_URL;
	if(url) {
		_baseUrl += url;		
	}
	return _baseUrl;
}

function _getPackageEndDate(){
	// TODO :: add proper way to set end datd package
	var currentDate = new Date();
	return currentDate.setMonth(currentDate.getMonth() + 2);
}
