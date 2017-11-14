var mongoose = require('mongoose');

var paymentInfoSchema = mongoose.Schema({
	userId : { type : String, required : '{PATH} is required!' },
	packageId : { type : String, required : '{PATH} is required!' },
	status: { type: String, default : "Pending" },	//Pending/Completed/Failed/Rejected
	description: { type: String },	//Status description
	mode: { type: String, required : '{PATH} is required!'},	//Cheque/Online/Cash
	startDate : { type : Date, default: Date.now },
	endDate : { type : Date, default: Date.now },
	created : { type : Date, default: Date.now },
	createdBy : { type : String, required : '{PATH} is required!'},
	updated :   { type : Date, default: Date.now },
	updatedBy : { type : String, required : '{PATH} is required!'}
});

var PaymentInfo = mongoose.model('PaymentInfo', paymentInfoSchema);

module.exports = {
	PaymentInfo : PaymentInfo
}
