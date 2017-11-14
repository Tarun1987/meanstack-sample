var mongoose = require('mongoose');

var availableClickSchema = mongoose.Schema({
	assignedTo : { type : String, required : '{PATH} is required!' },
	url :  { 
		id : { type : String, required : '{PATH} is required!' }, 
		link : { type : String, required : '{PATH} is required!' }
	 }, 
	paymentInfoId : { type : String, required : '{PATH} is required!' }, 
	isClicked : { type : Boolean, default : false },
	startDate : { type : Date, default: Date.now },
	endDate : { type : Date, required : '{PATH} is required!' },
	clickDate : { type : Date }
});

var AvailableClick = mongoose.model('AvailableClick', availableClickSchema);

module.exports = {
	AvailableClick : AvailableClick
};
