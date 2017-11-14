var _auth = require('../config/auth'),
	_urlDetailController = require('../controllers/UrlDetailController'),
	_mailSentController = require('../controllers/MailSentController'),
	_userController = require('../controllers/UserController'),
	_dashboardController = require('../controllers/DashboardController'),
	_settingController = require('../controllers/SettingController'),
	_userInfoController = require('../controllers/UserInfoController'),
	_packageController = require('../controllers/PackageController'),
	_paymentInfoController = require('../controllers/PaymentInfoController'),
	_constants = require('../utility/constants'),
	_payUController = require('../controllers/PayUController'),
	_newsletterController = require('../controllers/NewsletterController'),
	_clickController = require('../controllers/ClickController'),
	_notificationCtrl = require('../controllers/NotificationController'),
	_userQueryController = require('../controllers/UserQueryController');

var ADMIN = _constants.RoleTypes.Admin;

module.exports = function (app) {

	// Dashboard Controller actions
	app.post('/api/getQuickStats', _auth.requireApiLogin, _dashboardController.getQuickStats);

	// User Controller actions
	app.get('/api/users', _auth.requireApiLogin, _userController.getAll);
	app.delete('/api/users', _auth.requiresRole(ADMIN), _userController.remove);
	app.get('/api/getUserByProviderId', _userController.getByProviderId);
	app.get('/api/getUserById', _userController.getById);
	app.get('/api/getAllUsersCount', _auth.requireApiLogin, _userController.getAllCount);
	app.get('/api/getRecentlyAddedUser', _auth.requireApiLogin, _userController.getRecentlyAddedUser);
	app.post('/api/signup', _userController.create);
	app.put('/api/users', _auth.requireApiLogin, _userController.update);
	app.post('/api/sendResetPasswordLink', _userController.sendResetPasswordLink);
	app.post('/api/updateNewPassword', _userController.updateNewPassword);
	app.post('/api/verifyEmail', _userController.verifyEmail);
	app.post('/api/activateDeactivateUser', _auth.requiresRole(ADMIN), _userController.activateDeactivateUser);
	app.post('/api/uploadImage', _auth.requireApiLogin, _userController.uploadImage);

	// Notification stuff
	app.get('/api/getNotifications', _auth.requiresRole(ADMIN), _notificationCtrl.getAll);
	app.get('/api/getNotificationsCount', _auth.requiresRole(ADMIN), _notificationCtrl.getAllCount);


	// Setting Controller actions
	app.get('/api/setting', _auth.requiresRole(ADMIN), _settingController.getAll);
	app.post('/api/setting', _auth.requiresRole(ADMIN), _settingController.create);
	app.delete('/api/setting', _auth.requiresRole(ADMIN), _settingController.remove);
	app.get('/api/getAllSettingCount', _auth.requiresRole(ADMIN), _settingController.getAllCount);
	app.get('/api/setting/:id', _auth.requiresRole(ADMIN), _settingController.getById);
	app.get('/api/getById', _auth.requiresRole(ADMIN), _settingController.getById);
	app.put('/api/setting', _auth.requiresRole(ADMIN), _settingController.update);

	// Newsletter Controller actions
	app.get('/api/newsletter', _auth.requiresRole(ADMIN), _newsletterController.getAll);
	app.post('/api/sendNewsLetter', _auth.requiresRole(ADMIN), _newsletterController.sendNewsLetter);

	// User Info Controller actions
	app.get('/api/getUserInfoByUId', _auth.requireApiLogin, _userInfoController.getByUserId);
	app.post('/api/updateUserInfo', _auth.requireApiLogin, _userInfoController.updateUserInfo);

	// URL Details
	app.get('/api/urls', _auth.requireApiLogin, _urlDetailController.getAll);
	app.get('/api/uploadUrlsByFile', _urlDetailController.uploadUrlsByFile);
	app.get('/api/getAllUrlsCount', _auth.requireApiLogin, _urlDetailController.getAllCount);
	app.post('/api/urls', _auth.requireApiLogin, _urlDetailController.create);
	app.post('/api/uploadUrlsByFile', _auth.requireApiLogin, _urlDetailController.uploadUrlsByFile);
	app.delete('/api/urls', _auth.requireApiLogin, _urlDetailController.remove);

	// Get All Email Sents
	app.get('/api/sentemails/:id', _mailSentController.getById);
	app.get('/api/sentemails', _mailSentController.getAll);

	// Get All Packages
	//app.get('/api/packages/:id', _packageController.getById);
	app.get('/api/packages', _auth.requireApiLogin, _packageController.getAll);
	app.get('/api/getPopularPackages', _auth.requireApiLogin, _packageController.getPopularPackages);

	// Get All Payment Info	
	app.get('/api/payments', _auth.requireApiLogin, _paymentInfoController.getAll);
	app.get('/api/getAllPaymentHistoriesCount', _auth.requireApiLogin, _paymentInfoController.getAllPaymentHistoriesCount);
	app.post('/api/payments', _auth.requireApiLogin, _paymentInfoController.create);
	app.put('/api/payments', _auth.requiresRole(ADMIN), _paymentInfoController.update);

	// Make payment
	// TODO :: Need to add authentication later
	app.post('/api/makeOnlinePayment', _payUController.create);
	app.get('/api/payuSuccess', _payUController.payuSuccess);
	app.get('/api/payuFailure', _payUController.payuFailure);
	app.post('/api/payuSuccess', _payUController.payuSuccess);
	app.post('/api/payuFailure', _payUController.payuFailure);
	app.get('/api/getPaymentFailureDetail', _auth.requireApiLogin, _payUController.getPaymentFailureDetail)

	// Clicks section
	app.get('/api/assignLinks', _auth.requiresRole(ADMIN), _clickController.assignClicks);
	app.get('/api/getClicksForToday', _auth.requireApiLogin, _clickController.getClicksForToday);
	app.post('/api/updateLinkVisit', _auth.requireApiLogin, _clickController.updateLinkVisit);

	// User Query
	app.post('/api/submitQuery', _userQueryController.create);
	app.post('/api/getAllQueries', _auth.requiresRole(ADMIN), _userQueryController.getAll);

	// Globals
	app.get('/partials/admin/*', function (req, res) {
		res.render('../../public/admin/app/' + req.params[0]);
	});

	app.get('/partials/website/*', function (req, res) {
		res.render('../../public/website/app/' + req.params[0], {
			enableBundling: "true"
		});
	});

	app.post('/api/login', _auth.authenticate);

	app.post('/api/logout', function (req, res) {
		req.logout();
		res.send({ success: true });
	});

	app.all('/api/*', function (req, res) {
		res.send(404);
	});

	app.get('/admin/*', function (req, res) {
		res.render("admin-index", {
			bootstrappedUser: req.user,
			baseUrl: process.env.BASE_URL
		});
	});

	app.get('*', function (req, res) {
		res.render("index", {
			bootstrappedUser: req.user,
			baseUrl: process.env.BASE_URL
		});
	});
};