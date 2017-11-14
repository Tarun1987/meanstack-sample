var mongoose = require("mongoose");

// Set the user schema
var UrlDetailSchema = mongoose.Schema({
	link: { type : String, required : '{PATH} is required!' },
	created : { type : Date, default: Date.now },
	createdBy : { type : String},
	updated : { type : Date, default: Date.now },
	updatedBy : { type : String }
});

var UrlDetail = mongoose.model('UrlDetail', UrlDetailSchema);

module.exports = {
	UrlDetail : UrlDetail
}