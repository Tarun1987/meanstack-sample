var mongoose = require("mongoose");

// Set the user schema
var PayULogSchema = mongoose.Schema({
	userId: { type : String, required : '{Name} is required!' },
	type:   { type : String, required : '{Value} is required!' }, // REQUEST, RESPONSE
	detail: { type : String },
	created : { type : Date, default: Date.now },
	updated : { type : Date, default: Date.now },
});

var PayULog = mongoose.model('PayULog', PayULogSchema);

module.exports = {
	PayULog : PayULog
}