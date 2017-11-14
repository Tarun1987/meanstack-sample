var FailureRespose = require('../dto/FailureResponse'),
    _constants = require('../../utility/constants'),
    _siteHelpers = require('../../utility/siteHelpers'),
    _helpers = require('../../utility/responseHelper'),
	parseXlsx = require('excel');
    
module.exports = {
    upload : _upload,
    uploadExcel : _uploadExcel
}


//---------------------------------
// private functions
//---------------------------------
function _upload(done, req) {
    if (!req.files) {
		done.fail(new FailureRespose(_helpers.ResponseCode.BAD_REQUEST, _constants.messages.NO_FILE_UPLOADED))
    } else {
        var sampleFile = req.files.file;
        var fileName = req.files.file.name;
        var result =  _siteHelpers.getImageUploadAndDisplayUrl(fileName.split('.')[1]);
        sampleFile.mv(result.uploadUrl, function(err) {
            if(err){
                done.fail(new FailureRespose(_helpers.ResponseCode.INTERNAL_SERVER_ERROR, err.toString()))
            }else {
                done(result);
            }
        });
    }    
}


function _uploadExcel(done, req) {
    if (!req.files) {
		done.fail(new FailureRespose(_helpers.ResponseCode.BAD_REQUEST, _constants.messages.NO_FILE_UPLOADED))
    } else {
        var sampleFile = req.files.file;
        var fileName = req.files.file.name;
        var url =  _siteHelpers.getExcelFileUploadUrl(fileName.split('.')[1]);
        sampleFile.mv(url, function(err) {
            if(err){
                done.fail(new FailureRespose(_helpers.ResponseCode.INTERNAL_SERVER_ERROR, err.toString()))
            } else {
                parseXlsx(url, function(err, data) {
                    if(err) throw err;
                    var linkToSave = [];
                    for (var i = 0; i < data.length; i++) {
                        var link = data[i][0];
                        if(linkToSave.indexOf(link) < 0){
                            linkToSave.push(link);
                        }
                    }
                    done(linkToSave);
                });
            }
        });
    }    
}