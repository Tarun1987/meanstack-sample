var mongoose = require("mongoose"),
	userModel = require('../models/User'),
	passwordResetModel = require('../models/PasswordReset'),
	mailBodyModel = require('../models/MailBody'),
	mailSentModel = require('../models/MailSent'),
	paymentInfoModel = require('../models/PaymentInfo'),
	packageModel = require('../models/Package'),
	userInfoModel = require('../models/UserInfo'),
	settingModel = require('../models/Setting'),
	availableClickModel = require('../models/AvailableClick'),
	payULogModel = require('../models/PayULog'),
	notificationModel = require('../models/Notification'),
	urlDetailModel = require('../models/UrlDetail');

module.exports = function () {

	// Mongo DB connection
	mongoose.connect(process.env.MONGO_URL, { useMongoClient: true });
	var db = mongoose.connection;
	mongoose.Promise = global.Promise;
	db.on('error', console.error.bind(console, 'connection error ...'));
	db.once('open', function () {
		console.log("Connection opened");
	});

	userModel.createDefaultUsers();
	mailBodyModel.createDefaultMailBodies();
	packageModel.createDefaultPackage();
}