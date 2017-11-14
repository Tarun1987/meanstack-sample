var mongoose = require('mongoose');

var packageSchema = mongoose.Schema({
	name : { type : String, required : '{PATH} is required!' },
	price : { type : Number, default: 500 },
	description : { type : String },
	clicks : { type : Number, default:10 },
	isActive : { type : Boolean, default: true},
	created : { type : Date, default: Date.now },
	updated : { type : Date, default: Date.now }
});

var Package = mongoose.model('Package', packageSchema);


function createDefaultPackage() {
	Package.find({}).exec(function (err, collection) {
		if (collection.length === 0) {
			Package.create({name:'Basic Plan', description:'Basic Plan'});
		}
	});
}

module.exports = {
	createDefaultPackage : createDefaultPackage,
	Package : Package
}