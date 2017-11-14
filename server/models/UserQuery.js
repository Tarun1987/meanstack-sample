var mongoose = require("mongoose");

// Set the user schema
var UserQuerySchema = mongoose.Schema({
	name: { type : String, required : '{Name} is required!' },
	email: { type : String, required : '{Value} is required!' },
    mobile: { type : String, required : '{Value} is required!' },
    description: { type : String, required : '{Value} is required!' },
    queryType: { type : String, default : 'CONTACT_US' },
	created : { type : Date, default: Date.now }
});

var UserQuery = mongoose.model('UserQuery', UserQuerySchema);

module.exports = {
	UserQuery : UserQuery
}