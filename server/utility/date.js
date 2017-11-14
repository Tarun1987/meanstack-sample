var config = require("../config/config")[process.env.NODE_ENV];

exports.convertDate = function (str) {
	var date = str.split("/");
    
    if (!date.length === 3) {
        return false;
    }
    return date[1] + "," + date[0] + "," + date[2];
};