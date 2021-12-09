const mix = require('laravel-mix');
const fs = require("fs-extra");
const path = require("path");
const cliColor = require("cli-color");
const emojic = require("emojic");
const wpPot = require('wp-pot');
const min = Mix.inProduction() ? '.min' : '';
require("@tinypixelco/laravel-mix-wp-blocks");

const package_path = path.resolve(__dirname);
const package_slug = path.basename(path.resolve(package_path));

if (process.env.NODE_ENV === 'package') {

	mix.then(function () {

		const copyTo = path.resolve(`${package_slug}`);
		// Select All file then paste on list
		let includes = [
			'app',
			'assets',
			'languages',
			'templates',
			'vendor',
			'views',
			'index.php',
			'README.txt',
			'uninstall.php',
			'dist',
			`${package_slug}.php`];
		fs.ensureDir(copyTo, function (err) {
			if (err) return console.error(err);
			includes.map(include => {
				fs.copy(`${package_path}/${include}`, `${copyTo}/${include}`, function (err) {
					if (err) return console.error(err);
					console.log(cliColor.white(`=> ${emojic.smiley}  ${include} copied...`));
				})
			});
			console.log(cliColor.white(`=> ${emojic.whiteCheckMark}  Build directory created`));
		});
	});

	return;
}
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {

	if (Mix.inProduction()) {
		let languages = path.resolve('languages');
		fs.ensureDir(languages, function (err) {
			if (err) return console.error(err); // if file or folder does not exist
			wpPot({
				package: 'Classified Listing',
				bugReport: '',
				src: '**/*.php',
				domain: 'classified-listing',
				destFile: `languages/classified-listing.pot`
			});
		});

	}

	if (!Mix.inProduction()) {
		// mix.sourceMaps();
	}
	mix.options({
		terser: {
			extractComments: false,
		},
		processCssUrls: false
	});

	mix
		.block("src/blocks.js", "dist/blocks.build.js", {})
		.block("src/frontend.js", "dist/frontend.js");
	mix
		.sass("src/sass/admin-block.scss", "assets/css/admin-block.css");

	// mix.js(`src/js/common.js`, `assets/js/rtcl-common.min.js`)
	//     .babel(`src/js/admin.js`, `assets/js/rtcl-admin.min.js`)
	//     .babel(`src/js/admin-custom-fields.js`, `assets/js/rtcl-admin-custom-fields.min.js`)
	//     .js(`src/js/admin-ie.js`, `assets/js/rtcl-admin-ie.min.js`)
	//     .js(`src/js/business-hours.js`, `assets/js/business-hours.min.js`)
	//     .babel(`src/js/admin-listing-type.js`, `assets/js/rtcl-admin-listing-type.min.js`)
	//     .babel(`src/js/admin-settings.js`, `assets/js/rtcl-admin-settings.min.js`)
	//     .js(`src/js/admin-taxonomy.js`, `assets/js/rtcl-admin-taxonomy.min.js`)
	//     .babel(`src/js/admin-widget.js`, `assets/js/admin-widget.min.js`)
	//     .babel(`src/js/gallery.js`, `assets/js/rtcl-gallery${min}.js`)
	//     .babel(`src/js/login.js`, `assets/js/login.min.js`)
	//     .babel(`src/js/single-listing.js`, `assets/js/single-listing${min}.js`)
	//     .babel(`src/js/public.js`, `assets/js/rtcl-public${min}.js`)
	//     .babel(`src/js/public-add-post.js`, `assets/js/public-add-post${min}.js`)
	//     .babel(`src/js/rtcl-validator.js`, `assets/js/rtcl-validator${min}.js`)
	//     .babel(`src/js/rt-field-dependency.js`, `assets/js/rt-field-dependency.min.js`);

	// mix.sass(`src/sass/admin.scss`, `assets/css/rtcl-admin${min}.css`)
	//     .sass(`src/sass/bootstrap.scss`, `assets/css/rtcl-bootstrap.min.css`)
	//     .sass(`src/sass/public.scss`, `assets/css/rtcl-public${min}.css`);


	// mix.copy(`node_modules/jquery-validation/dist/jquery.validate.js`, `assets/vendor/jquery.validate.min.js`)
	//     .copy(`node_modules/daterangepicker/daterangepicker.js`, `assets/vendor/daterangepicker/daterangepicker.js`)
	//     .copy(`node_modules/select2/dist/js/select2.min.js`, `assets/vendor/select2/select2.min.js`)
	//     .copy(`src/vendor/jquery-ui-timepicker-addon.js`, `assets/vendor/jquery-ui-timepicker-addon.js`)
	//     .copy(`src/vendor/xlsx.full.min.js`, `assets/vendor/xlsx.full.min.js`)
	//     .copy(`src/vendor/xml2json.min.js`, `assets/vendor/xml2json.min.js`)
	//     .copy(`src/vendor/bootstrap/bootstrap.bundle.min.js`, `assets/vendor/bootstrap/bootstrap.bundle.min.js`)
	//     .copy(`node_modules/owl.carousel/dist/owl.carousel.min.js`, `assets/vendor/owl.carousel/owl.carousel.min.js`)
	//     .copy('node_modules/owl.carousel/dist/assets/ajax-loader.gif', 'assets/vendor/owl.carousel/ajax-loader.gif')
	//     .copy('node_modules/owl.carousel/dist/assets/owl.carousel.min.css', 'assets/vendor/owl.carousel/owl.carousel.min.css')
	//     .copy('node_modules/owl.carousel/dist/assets/owl.theme.default.min.css', 'assets/vendor/owl.carousel/owl.theme.default.min.css')
	//     .copyDirectory('src/sass/fonts', 'assets/fonts')
	//     .copyDirectory('src/images', 'assets/images');
}
