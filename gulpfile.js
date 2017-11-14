var websiteGlobalFiles = [
					'public/website/app/popup/bootstrap.dialog.js',
					'public/website/app/common/common.js',
					'public/website/app/common/logger.js',
					'public/website/app/app.js',
					'public/website/app/app.route.js'
            	  ];
var websiteContDirAndFilters = [
					'public/website/app/common/directives/*.js',
					'public/website/app/common/filters/*.js',
					'public/website/app/**/*controller.js'
				 ];

var websiteCommonFiles = [
					'public/website/js/jquery-1.11.3.min.js',
					'public/website/js/jquery-ui.js',
					'public/website/js/bootstrap.min.js',
					'public/website/js/waypoints.min.js',
					'public/website/js/scripts.js'
            ];

var websiteVendorFiles = [
                    'public/vendor/angular/angular.min.js',
                    'public/vendor/angular-resource/angular-resource.min.js',
                    'public/vendor/angular-sanitize/angular-sanitize.js',
					'public/vendor/angular-route/angular-route.min.js',
					'public/vendor/bootstrap.ui/ui-bootstrap-tpls-0.13.0.js',
					'public/vendor/ng-file-upload/ng-file-upload.min.js',
					'public/vendor/ng-img-crop/compile/minified/ng-img-crop.js',
					"public/vendor/paging/paging.js",
                    'public/vendor/toastr/toastr.js'
            ];

var adminPanelGlobalFiles = [
								'public/admin/app/common/common.js',
								'public/admin/app/common/logger.js',
								'public/admin/app/app.js',
								'public/admin/app/app.route.js'
							];
var adminContDirAndFilters = [
					'public/admin/app/common/filters/*.js',
					'public/admin/app/**/*controller.js'
				 ];

var adminVendorFiles = [
						"public/vendor/jquery/dist/jquery.min.js",
						"public/admin/scripts/app.js",
						"public/admin/scripts/bootstrap.min.js",
						"public/vendor/angular/angular.min.js",
						"public/vendor/angular-resource/angular-resource.min.js",
						"public/vendor/angular-route/angular-route.min.js",
						"public/vendor/toastr/toastr.js",
						"public/vendor/ngprogress/build/ngprogress.min.js",
						"public/vendor/angular-promise-buttons/dist/angular-promise-buttons.min.js",
						// "public/vendor/ng-ckeditor/libs/ckeditor/ckeditor.js",
						"public/vendor/ng-ckeditor/ng-ckeditor.min.js",
						"public/vendor/paging/paging.js",
						"public/vendor/ng-file-upload-shim/ng-file-upload-shim.min.js",
						"public/vendor/ng-file-upload/ng-file-upload.min.js"
					];


var STYLE_websiteCss = [
						'public/vendor/toastr/toastr.min.css',
						'public/website/css/bootstrap.min.css',
						'public/website/css/animate.css',
						'public/website/css/style.css',
						'public/website/css/jquery-ui.css',
						'public/website/css/media-queries.css'
];

var STYLE_adminCss = [

];

// ////////////////////////////////////////////////
// Required
// // /////////////////////////////////////////////

var gulp = require('gulp'),
	babel = require('gulp-babel');
	minify = require('gulp-minify'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	cleanCSS = require('gulp-clean-css'),
	del = require('del'),
	runSequence = require('run-sequence');


// ////////////////////////////////////////////////
// Scripts Tasks
// ///////////////////////////////////////////////

gulp.task('scripts::services', function() {
  	gulp.src('public/services/*.service.js')
	  	.pipe(babel({ presets: ['es2015'] }))
	  	.pipe(concat('services.js'))
	  	.pipe(minify())
	  	.pipe(uglify())
    	.pipe(gulp.dest('public/scripts/'))
});

gulp.task('scripts::wsglobal', function() {
  	gulp.src(websiteGlobalFiles)
	  	.pipe(babel({ presets: ['es2015'] }))
	  	.pipe(concat('ws.global.js'))
	  	.pipe(minify())
	  	.pipe(uglify())
    	.pipe(gulp.dest('public/scripts/'))
});

gulp.task('scripts::wscdaf', function() {
  	gulp.src(websiteContDirAndFilters)
	  	.pipe(babel({ presets: ['es2015'] }))
	  	.pipe(concat('ws.app.js'))
	  	.pipe(minify())
	  	.pipe(uglify())
    	.pipe(gulp.dest('public/scripts/'))
});

gulp.task('scripts::wscommon', function() {
  	gulp.src(websiteCommonFiles)
	  	.pipe(babel({ presets: ['es2015'] }))
	  	.pipe(concat('ws.common.js'))
	  	.pipe(minify())
	  	.pipe(uglify())
    	.pipe(gulp.dest('public/scripts/'))
});

gulp.task('scripts::wsvendor', function() {
  	gulp.src(websiteVendorFiles)
	  	.pipe(babel({ presets: ['es2015'] }))
	  	.pipe(concat('ws.vendor.js'))
	  	.pipe(minify())
	  	.pipe(uglify())
    	.pipe(gulp.dest('public/scripts/'))
});

gulp.task('scripts::apglobal', function() {
  	gulp.src(adminPanelGlobalFiles)
	  	.pipe(babel({ presets: ['es2015'] }))
	  	.pipe(concat('ap.global.js'))
	  	.pipe(minify())
	  	.pipe(uglify())
    	.pipe(gulp.dest('public/scripts/'))
});

gulp.task('scripts::apcdaf', function() {
  	gulp.src(adminContDirAndFilters)
	  	.pipe(babel({ presets: ['es2015'] }))
	  	.pipe(concat('ap.app.js'))
	  	.pipe(minify())
	  	.pipe(uglify())
    	.pipe(gulp.dest('public/scripts/'))
});

gulp.task('scripts::apvendor', function() {
  	gulp.src(adminVendorFiles)
	  	.pipe(babel({ presets: ['es2015'] }))
	  	.pipe(concat('ap.vendor.js'))
	  	.pipe(minify())
	  	.pipe(uglify())
    	.pipe(gulp.dest('public/scripts/'))
});

// ////////////////////////////////////////////////
// STYLE Tasks
// // /////////////////////////////////////////////
gulp.task('style::wscss', function() {
  	gulp.src(STYLE_websiteCss)
	  	.pipe(concat('ws.all-min.css'))
	  	.pipe(cleanCSS({compatibility: 'ie8'}))
    	.pipe(gulp.dest('public/website/css'))
});

// ////////////////////////////////////////////////
// Watch Tasks
// // /////////////////////////////////////////////

gulp.task ('watch', function(){
	gulp.watch('public/services/*.service.js', function() { runSequence('scripts::services', 'delete::extra_files') });
	gulp.watch(websiteGlobalFiles,  function() { runSequence('scripts::wsglobal', 'delete::extra_files') });
	gulp.watch(websiteContDirAndFilters, function() { runSequence('scripts::wscdaf', 'delete::extra_files') });
	gulp.watch(adminPanelGlobalFiles, function() { runSequence('scripts::apglobal', 'delete::extra_files') });
	gulp.watch(adminContDirAndFilters,function() { runSequence('scripts::apcdaf', 'delete::extra_files') });
	gulp.watch(STYLE_websiteCss, ['style::wscss']);	
});

gulp.task('delete::extra_files', function() {
  return del.sync(['public/scripts/*.js', '!public/scripts/*min.js']);
})

// ////////////////////////////////////////////////
// Build Tasks
// // /////////////////////////////////////////////
var _buildFolderName = 'bin/shawnwl';
gulp.task('build::copy_folder_structure', function() {
  return gulp.src('*')
  .pipe(gulp.dest(_buildFolderName))
})

gulp.task('build::copy_public_folder', function() {
  return gulp.src('public/**')
  .pipe(gulp.dest(_buildFolderName + '/public'))
})

gulp.task('build::copy_server_folder', function() {
  return gulp.src('server/**')
  .pipe(gulp.dest(_buildFolderName + '/server'))
})

gulp.task('build::delete_extra_files_from_build', function() {
  return del.sync([ _buildFolderName +'/'+ _buildFolderName , 
  					_buildFolderName + '/node_modules', 
					_buildFolderName +'/gulpfile.js',
					_buildFolderName +'/public/vendor',
					_buildFolderName +'/public/services',
					_buildFolderName +'/public/website/js', 
					_buildFolderName + '/public/website/app/**/*.js',
					_buildFolderName + '/public/scripts/*.js', '!'+ _buildFolderName + '/public/scripts/*min.js',
					_buildFolderName + '/public/website/css/**', '!'+ _buildFolderName + '/public/website/css', '!'+ _buildFolderName + '/public/website/css/ws.all-min.css',
					_buildFolderName +'/public/admin/scripts',
					_buildFolderName + '/public/admin/app/**/*.js',
				  ]);
})

gulp.task('build', function (callback) {
  	runSequence('build::copy_folder_structure', 
	  			['build::copy_public_folder', 'build::copy_server_folder'], 
				['build::delete_extra_files_from_build'] , function( ) {

	});
})

// ////////////////////////////////////////////////
// Default Tasks
// // /////////////////////////////////////////////
gulp.task('default', [	 
						'style::wscss',
						 'scripts::services', 
						 'scripts::wsglobal', 
						 'scripts::wscdaf', 
						 'scripts::wsvendor', 
						 'scripts::wscommon',
						 'scripts::apvendor',
						 'scripts::apcdaf',
						 'scripts::apglobal',
						 'watch'
					 ]);