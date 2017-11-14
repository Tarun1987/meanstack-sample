var express = require("express"),
	stylus = require("stylus"),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	passport = require('passport'),
	bodyParser = require('body-parser'),
	fileUpload = require('express-fileupload'),
	_config = require('./config');

module.exports = function (app) {
	
	function compile(str, path) {
		return stylus(str).set('filename', path);
	}
	

	app.set('views', _config.rootPath  + '/server/views');
	app.set('view engine', 'jade');
	app.use(logger('dev'));
	app.use(bodyParser.urlencoded({ extended : true }));
	app.use(cookieParser('secret'));
	app.use(bodyParser.json());
	app.use(session({ secret: 'swl', cookie: { maxAge: 3600000 }, resave: true, saveUninitialized: true }))
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(fileUpload());
	app.use(stylus.middleware(
		{
			src: _config.rootPath + '/public',
			compile : compile
		}
	));
	
	app.use(express.static(_config.rootPath + '/public'));
};
