var mongoose = require("mongoose");

// Set the user schema
var SettingSchema = mongoose.Schema({
	name: { type : String, required : '{Name} is required!' },
	value: { type : String, required : '{Value} is required!' },
	description: { type : String},
	isActive: { type : Boolean, default: true },
	created : { type : Date, default: Date.now },
	updated : { type : Date, default: Date.now },
});

var Setting = mongoose.model('Setting', SettingSchema);

function createDefaultSetting() {
	Setting.find({}).exec(function (err, collection) {
		if (collection.length === 0) {
			Setting.create({ name : 'DefaultContactEmail' , value : 'tkhatana@gmail.com' });
		}
	});
}

module.exports = {
	Setting : Setting,
	createDefaultSetting : createDefaultSetting
}