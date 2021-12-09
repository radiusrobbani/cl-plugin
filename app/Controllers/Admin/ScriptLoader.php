<?php

namespace Rtcl\Controllers\Admin;

use Rtcl\Helpers\Functions;

/**
 * Class ScriptLoader
 *
 * @package Rtcl\Controllers\Admin
 */
class ScriptLoader
{

	private $suffix;
	private $version;
	private $ajaxurl;

	/**
	 * Contains an array of script handles localized by RTCL.
	 *
	 * @var array
	 */
	private static $wp_localize_scripts = array();

	function __construct() {
		$this->suffix = (defined('SCRIPT_DEBUG') && SCRIPT_DEBUG) ? '' : '.min';
		$this->version = (defined('WP_DEBUG') && WP_DEBUG) ? time() : RTCL_VERSION;
		$this->ajaxurl = admin_url('admin-ajax.php');
		if ($current_lang = apply_filters('rtcl_ajaxurl_current_lang', null, $this->ajaxurl)) {
			$this->ajaxurl = add_query_arg('lang', $current_lang, $this->ajaxurl);
		}

		add_action('wp_enqueue_scripts', [$this, 'register_script'], 1);
		add_action('admin_init', [$this, 'register_admin_script'], 1);
		add_action('admin_enqueue_scripts', [$this, 'load_admin_script_post_type_listing']);
		add_action('admin_enqueue_scripts', [$this, 'load_admin_script_payment']);
		add_action('admin_enqueue_scripts', [$this, 'load_admin_script_pricing']);
		add_action('admin_enqueue_scripts', [$this, 'load_admin_script_setting_page']);
		add_action('admin_enqueue_scripts', [$this, 'load_admin_script_listing_types_page']);
		add_action('admin_enqueue_scripts', [$this, 'load_admin_script_ie_page']);
		add_action('admin_enqueue_scripts', [$this, 'load_admin_script_page_custom_fields']);
		add_action('admin_enqueue_scripts', [$this, 'load_admin_script_taxonomy']);
		add_action('admin_enqueue_scripts', [$this, 'load_script_at_widget_settings']);
		add_action('login_enqueue_scripts', [$this, 'resend_verification_link']);
	}

	function resend_verification_link() {
		wp_register_script('rtcl-verify-js', rtcl()->get_assets_uri("js/login.min.js"), [
			'jquery',
			'rtcl-common'
		], null, true);
		wp_localize_script('rtcl-verify-js', 'rtcl', [
			'ajaxurl'              => $this->ajaxurl,
			're_send_confirm_text' => esc_html__('Are you sure you want to re-send verification link?', "classified-listing"),
			rtcl()->nonceId        => wp_create_nonce(rtcl()->nonceText),
		]);
		wp_enqueue_script('rtcl-verify-js');
	}

	function register_script_both_end() {
		wp_register_script('rt-field-dependency', rtcl()->get_assets_uri("js/rt-field-dependency.min.js"), ['jquery'], $this->version, true);
		wp_register_script('rtcl-common', rtcl()->get_assets_uri("js/rtcl-common.min.js"), ['jquery'], $this->version);
		wp_register_script('select2', rtcl()->get_assets_uri("vendor/select2/select2.min.js"), array('jquery'));
		wp_register_script('daterangepicker', rtcl()->get_assets_uri("vendor/daterangepicker/daterangepicker.js"),
			array('jquery', 'moment'), '3.0.5');
		wp_register_script('jquery-validator', rtcl()->get_assets_uri("vendor/jquery.validate.min.js"),
			array('jquery'), '1.19.1');
		wp_register_script('rtcl-validator', rtcl()->get_assets_uri("js/rtcl-validator{$this->suffix}.js"),
			array('jquery-validator'), $this->version);
		wp_register_script('rtcl-gallery', rtcl()->get_assets_uri("js/rtcl-gallery{$this->suffix}.js"),
			array(
				'jquery',
				'plupload-all',
				'jquery-ui-sortable',
				'jquery-effects-core',
				'jquery-effects-fade',
				'wp-util',
				'jcrop'
			),
			$this->version, true);
		wp_localize_script('rtcl-gallery', 'rtcl_gallery_lang', array(
			"ajaxurl"               => $this->ajaxurl,
			"edit_image"            => esc_html__("Edit Image", "classified-listing"),
			"delete_image"          => esc_html__("Delete Image", "classified-listing"),
			"view_image"            => esc_html__("View Full Image", "classified-listing"),
			"featured"              => esc_html__("Main", "classified-listing"),
			"error_common"          => esc_html__("Error while upload image", "classified-listing"),
			"error_image_size"      => sprintf(__("Image size is more then %s.", "classified-listing"), Functions::formatBytes(Functions::get_max_upload())),
			"error_image_limit"     => esc_html__("Image limit is over.", "classified-listing"),
			"error_image_extension" => esc_html__("File extension not supported.", "classified-listing"),
		));

		wp_localize_script('rtcl-validator', 'rtcl_validator', apply_filters('rtcl_validator_localize', array(
			"messages"      => array(
				'session_expired' => esc_html__("Session Expired!!", "classified-listing"),
				'server_error'    => esc_html__("Server Error!!", "classified-listing"),
				"required"        => esc_html__("This field is required.", "classified-listing"),
				"remote"          => esc_html__("Please fix this field.", "classified-listing"),
				"email"           => esc_html__("Please enter a valid email address.", "classified-listing"),
				"url"             => esc_html__("Please enter a valid URL.", "classified-listing"),
				"date"            => esc_html__("Please enter a valid date.", "classified-listing"),
				"dateISO"         => esc_html__("Please enter a valid date (ISO).", "classified-listing"),
				"number"          => esc_html__("Please enter a valid number.", "classified-listing"),
				"digits"          => esc_html__("Please enter only digits.", "classified-listing"),
				"equalTo"         => esc_html__("Please enter the same value again.", "classified-listing"),
				"maxlength"       => esc_html__("Please enter no more than {0} characters.", "classified-listing"),
				"minlength"       => esc_html__("Please enter at least {0} characters.", "classified-listing"),
				"rangelength"     => esc_html__("Please enter a value between {0} and {1} characters long.", "classified-listing"),
				"range"           => esc_html__("Please enter a value between {0} and {1}.", "classified-listing"),
				"pattern"         => esc_html__("Invalid format.", "classified-listing"),
				"maxWords"        => esc_html__("Please enter {0} words or less.", "classified-listing"),
				"minWords"        => esc_html__("Please enter at least {0} words.", "classified-listing"),
				"rangeWords"      => esc_html__("Please enter between {0} and {1} words.", "classified-listing"),
				"alphanumeric"    => esc_html__("Letters, numbers, and underscores only please", "classified-listing"),
				"lettersonly"     => esc_html__("Only alphabets and spaces are allowed.", "classified-listing"),
				"accept"          => esc_html__("Please enter a value with a valid mimetype.", "classified-listing"),
				"max"             => esc_html__("Please enter a value less than or equal to {0}.", "classified-listing"),
				"min"             => esc_html__("Please enter a value greater than or equal to {0}.", "classified-listing"),
				"step"            => esc_html__("Please enter a multiple of {0}.", "classified-listing"),
				"extension"       => esc_html__("Please Select a value file with a valid extension.", "classified-listing"),
				"password"        => sprintf(esc_html__("Your password must be at least %d characters long.", "classified-listing"), Functions::password_min_length()),
				"cc"              => array(
					"number"           => esc_html__("Please enter a valid credit card number.", "classified-listing"),
					"cvc"              => esc_html__("Enter a valid cvc number.", "classified-listing"),
					"expiry"           => esc_html__("Enter a valid expiry date", "classified-listing"),
					"incorrect_number" => esc_html__("Your card number is incorrect.", "classified-listing"),
					"abort"            => esc_html__("A network error has occurred, and you have not been charged. Please try again.", "classified-listing")
				)
			),
			"pwsL10n"       => [
				'unknown'  => esc_html__('Password strength unknown', 'classified-listing'),
				'short'    => esc_html__('Very weak', 'classified-listing'),
				'bad'      => esc_html__('Weak', 'classified-listing'),
				'good'     => esc_html__('Medium', 'classified-listing'),
				'strong'   => esc_html__('Strong', 'classified-listing'),
				'mismatch' => esc_html__('Mismatch', 'classified-listing'),
			],
			"scroll_top"    => 200,
			"pw_min_length" => Functions::password_min_length()
		)));
	}

	function register_script() {

		global $post;

		$this->register_script_both_end();
		$moderation_settings = Functions::get_option('rtcl_moderation_settings');
		$misc_settings = Functions::get_option('rtcl_misc_settings');
		$general_settings = Functions::get_option('rtcl_general_settings');
		$depsStyle = [];
		if (!empty($general_settings['load_bootstrap']) && in_array('css', $general_settings['load_bootstrap'])) {
			wp_register_style('rtcl-bootstrap', rtcl()->get_assets_uri("css/rtcl-bootstrap.min.css"), array(), '4.1.1');
			$depsStyle[] = 'rtcl-bootstrap';
		}


		$depsScript = ['jquery', 'jquery-ui-autocomplete', 'rtcl-common'];
		if (!empty($general_settings['load_bootstrap']) && in_array('js', $general_settings['load_bootstrap'])) {
			wp_register_script('rtcl-bootstrap', rtcl()->get_assets_uri("vendor/bootstrap/bootstrap.bundle.min.js"), array('jquery'), '4.1.1', true);
			$depsScript[] = 'rtcl-bootstrap';
		}

		wp_register_script('owl-carousel', rtcl()->get_assets_uri("vendor/owl.carousel/owl.carousel.min.js"), array(
			'jquery',
			'imagesloaded'
		));

		wp_register_style('owl-carousel', rtcl()->get_assets_uri("vendor/owl.carousel/owl.carousel.min.css"), array(), $this->version);

		wp_register_script('rtcl-single-listing', rtcl()->get_assets_uri("js/single-listing{$this->suffix}.js"), apply_filters('rtcl_single_listing_script_dependency', ['owl-carousel']), $this->version, true);
		self::localize_script('rtcl-single-listing');
		if (is_singular(rtcl()->post_type)) {
			$depsStyle[] = 'owl-carousel';
			wp_enqueue_script('rtcl-single-listing');
		}


		wp_register_script('rtcl-public-add-post', rtcl()->get_assets_uri("js/public-add-post{$this->suffix}.js"), array(
			'jquery',
			'daterangepicker'
		),
			$this->version, true);
		wp_register_script("rtcl-recaptcha",
			"https://www.google.com/recaptcha/api.js?onload=rtcl_on_recaptcha_load&render=explicit", '', $this->version,
			true);
		wp_register_script('rtcl-public', rtcl()->get_assets_uri("js/rtcl-public{$this->suffix}.js"), $depsScript, $this->version, true);
		wp_register_style('rtcl-public', rtcl()->get_assets_uri("css/rtcl-public{$this->suffix}.css"), $depsStyle, $this->version);

		do_action('rtcl_before_enqueue_script');

		// Load script
		if (wp_script_is('rtcl-bootstrap', 'registered')) {
			wp_enqueue_script('rtcl-bootstrap');
		}
		if (wp_style_is('rtcl-bootstrap', 'registered')) {
			wp_enqueue_style('rtcl-bootstrap');
		}
		wp_enqueue_style('rtcl-public');

		$validator_script = false;
		global $wp;
		if (Functions::is_account_page()) {
			if (!is_user_logged_in() || isset($wp->query_vars['lost-password'])) {
				$validator_script = true;
			}
			if (isset($wp->query_vars['edit-account']) || isset($wp->query_vars['rtcl_edit_account'])) {
				$validator_script = true;
				wp_enqueue_script('rtcl-public-add-post');
			}
			if (Functions::get_option_item('rtcl_misc_settings', 'recaptcha_forms', 'registration', 'multi_checkbox')) {
				wp_enqueue_script('rtcl-recaptcha');
			}
		}

		if (Functions::is_checkout_page()) {
			$validator_script = true;
		}
		if (Functions::is_listing_form_page()) {
			$validator_script = true;
			wp_enqueue_script('rtcl-gallery');
			wp_enqueue_script('select2');
			wp_enqueue_script('rt-field-dependency');
			wp_enqueue_script('rtcl-public-add-post');
			if (Functions::get_option_item('rtcl_misc_settings', 'recaptcha_forms', 'listing', 'multi_checkbox')) {
				wp_enqueue_script('rtcl-recaptcha');
			}
		}

		if (is_singular(rtcl()->post_type)) {
			$validator_script = true;
			if (Functions::get_option_item('rtcl_misc_settings', 'recaptcha_forms', 'contact', 'multi_checkbox')
				|| Functions::get_option_item('rtcl_misc_settings', 'recaptcha_forms', 'report_abuse', 'multi_checkbox')) {
				wp_enqueue_script('rtcl-recaptcha');
			}
		}

		if ($validator_script) {
			wp_enqueue_script('rtcl-validator');
		}
		wp_enqueue_script('daterangepicker');
		wp_enqueue_script('rtcl-public');

		$rtcl_style_opt = Functions::get_option("rtcl_style_settings");
		$style = null;
		if (is_array($rtcl_style_opt) && !empty($rtcl_style_opt)) {
			$primary = !empty($rtcl_style_opt['primary']) ? $rtcl_style_opt['primary'] : null;
			if ($primary) {
				$style .= ".rtcl .listing-price.rtcl-price .rtcl-price-amount, .rtcl .rtcl-list-view .listing-price .rtcl-price-amount{ background-color: $primary; border-color: $primary;}";
				$style .= ".rtcl .listing-price.rtcl-price .rtcl-price-amount:before, .rtcl .rtcl-list-view .listing-price .rtcl-price-amount:before{border-right-color: $primary;}";
				$style .= ".rtcl .rtcl-listable .rtcl-listable-item{color: $primary;}";
				$style .= ".rtcl .rtcl-icon, 
							.rtcl-chat-form button.rtcl-chat-send, 
							.rtcl-chat-container a.rtcl-chat-card-link .rtcl-cc-content .rtcl-cc-listing-amount,
							.rtcl-chat-container ul.rtcl-messages-list .rtcl-message span.read-receipt-status .rtcl-icon.rtcl-read{color: $primary;}";
				$style .= "#rtcl-chat-modal {background-color: $primary; border-color: $primary}";
				$style .= "#rtcl-compare-btn-wrap a.rtcl-compare-btn, .rtcl-btn, #rtcl-compare-panel-btn, .rtcl-chat-container .rtcl-conversations-header, .rtcl-chat-container ul.rtcl-messages-list .rtcl-message-wrap.own-message .rtcl-message-text, .rtcl-sold-out {background : $primary;}";
			}
			$link = !empty($rtcl_style_opt['link']) ? $rtcl_style_opt['link'] : null;
			if ($link) {
				$style .= ".rtcl a{ color: $link}";
			}
			$linkHover = !empty($rtcl_style_opt['link_hover']) ? $rtcl_style_opt['link_hover'] : null;
			if ($link) {
				$style .= ".rtcl a:hover{ color: $linkHover}";
			}
			// Button
			$button = !empty($rtcl_style_opt['button']) ? $rtcl_style_opt['button'] : null;
			if ($button) {
				$style .= ".rtcl .btn{ background-color: $button; border-color:$button; }";
				$style .= ".rtcl .owl-carousel .owl-nav [class*=owl-],
                            .rtcl .rtcl-slider .rtcl-listing-gallery__trigger{ background-color: $button; }";
				$style .= ".rtcl-pagination ul.page-numbers li a.page-numbers{ background-color: $button; }";
			}
			$buttonText = !empty($rtcl_style_opt['button_text']) ? $rtcl_style_opt['button_text'] : null;
			if ($buttonText) {
				$style .= ".rtcl .btn{ color:$buttonText; }";
				$style .= ".rtcl .owl-carousel .owl-nav [class*=owl-],.rtcl .rtcl-slider .rtcl-listing-gallery__trigger{ color: $buttonText; }";
				$style .= ".rtcl-pagination ul.page-numbers li a.page-numbers{ color: $buttonText; }";
			}

			// Button hover
			$buttonHover = !empty($rtcl_style_opt['button_hover']) ? $rtcl_style_opt['button_hover'] : null;
			if ($buttonHover) {
				$style .= ".rtcl-pagination ul.page-numbers li span.page-numbers.current,.rtcl-pagination ul.page-numbers li a.page-numbers:hover{ background-color: $buttonHover; }";
				$style .= ".rtcl .btn:hover{ background-color: $buttonHover; border-color:$buttonHover; }";
				$style .= ".rtcl .owl-carousel .owl-nav [class*=owl-]:hover,.rtcl .rtcl-slider .rtcl-listing-gallery__trigger:hover{ background-color: $buttonHover; }";
			}
			$buttonHoverText = !empty($rtcl_style_opt['button_hover_text']) ? $rtcl_style_opt['button_hover_text'] : null;
			if ($buttonHoverText) {
				$style .= ".rtcl-pagination ul.page-numbers li a.page-numbers:hover, .rtcl-pagination ul.page-numbers li span.page-numbers.current{ color: $buttonHoverText; }";
				$style .= ".rtcl .btn:hover{ color: $buttonHoverText}";
				$style .= ".rtcl .owl-carousel .owl-nav [class*=owl-]:hover,.rtcl .rtcl-slider .rtcl-listing-gallery__trigger{ color: $buttonHoverText; }";
			}

			// New
			$new = !empty($rtcl_style_opt['new']) ? $rtcl_style_opt['new'] : null;
			if ($new) {
				$style .= ".rtcl .rtcl-badge-new{ background-color: $new; }";
			}
			$newText = !empty($rtcl_style_opt['new_text']) ? $rtcl_style_opt['new_text'] : null;
			if ($newText) {
				$style .= ".rtcl .rtcl-badge-new{ color: $newText; }";
			}

			// Feature
			$feature = !empty($rtcl_style_opt['feature']) ? $rtcl_style_opt['feature'] : null;
			if ($feature) {
				$style .= ".rtcl .rtcl-badge-featured{ background-color: $feature; }";
			}
			$featureText = !empty($rtcl_style_opt['feature_text']) ? $rtcl_style_opt['feature_text'] : null;
			if ($featureText) {
				$style .= ".rtcl .rtcl-badge-featured{ color: $featureText; }";
			}
		}
		$style = apply_filters('rtcl_public_inline_style', $style, $rtcl_style_opt);
		if ($style) {
			wp_add_inline_style('rtcl-public', $style);
		}

		if (!empty($misc_settings['recaptcha_site_key']) && !empty($misc_settings['recaptcha_forms'])) {
			$recaptcha_site_key = $misc_settings['recaptcha_site_key'];
			$recaptcha = $misc_settings['recaptcha_forms'];
			$recaptcha_condition['has_contact_form'] = !empty($moderation_settings['has_contact_form']) && $moderation_settings['has_contact_form'] == 'yes' ? 1 : 0;
			$recaptcha_condition['has_report_abuse'] = !empty($moderation_settings['has_report_abuse']) && $moderation_settings['has_report_abuse'] == 'yes' ? 1 : 0;
			$recaptcha_condition['listing'] = in_array('listing', $misc_settings['recaptcha_forms']) ? 1 : 0;
		} else {
			$recaptcha_site_key = '';
			$recaptcha = $recaptcha_condition = [];
		}

		$decimal_separator = Functions::get_decimal_separator();
		$localize = array(
			'plugin_url'                   => RTCL_URL,
			'decimal_point'                => $decimal_separator,
			'i18n_required_rating_text'    => esc_attr__('Please select a rating', 'classified-listing'),
			/* translators: %s: decimal */
			'i18n_decimal_error'           => sprintf(__('Please enter in decimal (%s) format without thousand separators.', 'classified-listing'), $decimal_separator),
			/* translators: %s: price decimal separator */
			'i18n_mon_decimal_error'       => sprintf(__('Please enter in monetary decimal (%s) format without thousand separators and currency symbols.', 'classified-listing'), $decimal_separator),
			'is_rtl'                       => is_rtl(),
			'is_admin'                     => is_admin(),
			"ajaxurl"                      => $this->ajaxurl,
			'confirm_text'                 => esc_html__("Are you sure to delete?", "classified-listing"),
			're_send_confirm_text'         => esc_html__('Are you sure you want to re-send verification link?', "classified-listing"),
			rtcl()->nonceId                => wp_create_nonce(rtcl()->nonceText),
			'rtcl_category'                => get_query_var('rtcl_category'),
			'category_text'                => esc_html__("Category", "classified-listing"),
			'go_back'                      => esc_html__("Go back", "classified-listing"),
			'location_text'                => esc_html__("Location", "classified-listing"),
			'rtcl_location'                => get_query_var('rtcl_location'),
			'recaptchas'                   => $recaptcha,
			'recaptchas_condition'         => $recaptcha_condition,
			'recaptcha_site_key'           => $recaptcha_site_key,
			'recaptcha_responce'           => array(
				'registration' => 0,
				'listing'      => 0,
				'contact'      => 0,
				'report_abuse' => 0
			),
			'recaptcha_invalid_message'    => esc_html__("You can't leave Captcha Code empty", 'classified-listing'),
			'user_login_alert_message'     => esc_html__('Sorry, you need to login first.', 'classified-listing'),
			'upload_limit_alert_message'   => esc_html__('Sorry, you have only %d images pending.', 'classified-listing'),
			'delete_label'                 => esc_html__('Delete Permanently', 'classified-listing'),
			'proceed_to_payment_btn_label' => esc_html__('Proceed to payment', 'classified-listing'),
			'finish_submission_btn_label'  => esc_html__('Finish submission', 'classified-listing'),
			'phone_number_placeholder'     => apply_filters('rtcl_phone_number_placeholder', 'XXX')
		);
		if (is_singular(rtcl()->post_type)) {
			$localize['post_id'] = $post->ID;
		}
		if (isset($wp->query_vars['edit-account']) || isset($wp->query_vars['rtcl_edit_account'])) {
			$max_image_size = Functions::get_max_upload();
			$localize["image_allowed_type"] = (array)Functions::get_option_item('rtcl_misc_settings', 'image_allowed_type');
			$localize["max_image_size"] = $max_image_size;
			$localize["error_upload_common"] = esc_html__("Error while upload image", "classified-listing");
			$localize["error_image_size"] = sprintf(__("Image size is more then %s.", "classified-listing"), Functions::formatBytes($max_image_size));
			$localize["error_image_extension"] = esc_html__("File extension not supported.", "classified-listing");
		}
		wp_localize_script('rtcl-public', 'rtcl', apply_filters('rtcl_localize_params_public', $localize));
		wp_localize_script('rtcl-public-add-post', 'rtcl_add_post', apply_filters('rtcl_localize_params_add_post', array(
			'hide_ad_type' => Functions::is_ad_type_disabled(),
			'form_uri'     => is_object($post) ? get_permalink($post->ID) : null,
			'message'      => array(
				'ad_type'    => esc_html__("Please select ad type first", "classified-listing"),
				'parent_cat' => esc_html__("Please select parent category first", "classified-listing")
			)
		)));
	}

	function register_admin_script() {
		$this->register_script_both_end();
		wp_register_script('rtcl-admin-widget', rtcl()->get_assets_uri("js/admin-widget.min.js"), array('jquery'), $this->version);
		wp_register_script('rtcl-timepicker', rtcl()->get_assets_uri("vendor/jquery-ui-timepicker-addon.js"), array('jquery'), $this->version, true);
		wp_register_script('rtcl-admin', rtcl()->get_assets_uri("js/rtcl-admin.min.js"), array(
			'jquery',
			'rtcl-common'
		), $this->version, true);
		wp_register_script('rtcl-admin-settings', rtcl()->get_assets_uri("js/rtcl-admin-settings.min.js"), array(
			'jquery',
			'rtcl-common',
			'wp-color-picker'
		),
			$this->version, true);
		wp_register_script('rtcl-admin-ie', rtcl()->get_assets_uri("js/rtcl-admin-ie.min.js"), array(
			'jquery',
			'rtcl-validator'
		), $this->version, true);
		wp_register_script('rtcl-admin-listing-type', rtcl()->get_assets_uri("js/rtcl-admin-listing-type.min.js"), array(
			'jquery'
		), $this->version, true);
		wp_register_script('rtcl-admin-taxonomy', rtcl()->get_assets_uri("js/rtcl-admin-taxonomy.min.js"), array('jquery'),
			$this->version, true);
		wp_register_script('rtcl-admin-custom-fields', rtcl()->get_assets_uri("js/rtcl-admin-custom-fields.min.js"),
			[
				'jquery',
				'rtcl-common',
				'jquery-ui-dialog',
				'jquery-ui-sortable',
				'jquery-ui-draggable',
				'jquery-ui-tabs'
			],
			$this->version, true);

		$decimal_separator = Functions::get_decimal_separator();
		$pricing_decimal_separator = Functions::get_decimal_separator(true);
		wp_localize_script('rtcl-admin', 'rtcl', apply_filters('rtcl_localize_params_admin', array(
			"ajaxurl"                        => $this->ajaxurl,
			'decimal_point'                  => $decimal_separator,
			'pricing_decimal_point'          => $pricing_decimal_separator,
			'i18n_decimal_error'             => sprintf(__('Please enter in decimal (%s) format without thousand separators.', 'classified-listing'), $decimal_separator),
			'i18n_pricing_decimal_error'     => sprintf(__('Please enter in decimal (%s) format without thousand separators.', 'classified-listing'), $pricing_decimal_separator),
			'i18n_mon_decimal_error'         => sprintf(__('Please enter in monetary decimal (%s) format without thousand separators and currency symbols.', 'classified-listing'), $decimal_separator),
			'i18n_mon_pricing_decimal_error' => sprintf(__('Please enter in monetary decimal (%s) format without thousand separators and currency symbols.', 'classified-listing'), $pricing_decimal_separator),
			'is_admin'                       => is_admin(),
			rtcl()->nonceId                  => wp_create_nonce(rtcl()->nonceText),
			'expiredOn'                      => esc_html__('Expired on:', 'classified-listing'),
			'dateFormat'                     => esc_html__('%1$s %2$s, %3$s @ %4$s:%5$s', 'classified-listing'),
			'i18n_delete_note'               => esc_html__('Are you sure you wish to delete this note? This action cannot be undone.', 'classified-listing'),
		)));


		wp_register_style('rtcl-bootstrap', rtcl()->get_assets_uri("css/rtcl-bootstrap.min.css"), array(), '4.1.0');
		wp_register_style('rtcl-admin', rtcl()->get_assets_uri("css/rtcl-admin{$this->suffix}.css"), array('rtcl-bootstrap'), $this->version);
		wp_register_style('jquery-ui', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css');
	}

	function load_admin_script_page_custom_fields() {
		global $pagenow, $post_type;
		if (!in_array($pagenow, array('post.php', 'post-new.php', 'edit.php'))) {
			return;
		}
		if (rtcl()->post_type_cfg != $post_type) {
			return;
		}
		wp_enqueue_style('rtcl-admin');
		wp_enqueue_style('wp-jquery-ui-dialog');
		wp_enqueue_script('select2');
		wp_enqueue_script('rtcl-admin-custom-fields');

		wp_localize_script('rtcl-admin-custom-fields', 'rtcl_cfg', array(
			"ajaxurl"       => $this->ajaxurl,
			rtcl()->nonceId => wp_create_nonce(rtcl()->nonceText),
		));

	}

	function load_admin_script_setting_page() {
		if (!empty($_GET['post_type']) && $_GET['post_type'] == rtcl()->post_type && !empty($_GET['page']) && $_GET['page'] == 'rtcl-settings') {
			wp_enqueue_media();
			wp_enqueue_style('rtcl-admin');
			wp_enqueue_script('rt-field-dependency');
			wp_enqueue_script('select2');
			if (isset($_GET['tab']) && 'misc' === $_GET['tab'] && wp_script_is('rtcl-google-map', 'registered')) {
				wp_enqueue_script('rtcl-map');
			}
			// Add the color picker css file
			wp_enqueue_style('wp-color-picker');
			wp_enqueue_script('rtcl-admin-settings');
		}
	}

	function load_admin_script_listing_types_page() {
		if (!empty($_GET['post_type']) && $_GET['post_type'] == rtcl()->post_type && !empty($_GET['page']) && $_GET['page'] == 'rtcl-listing-type') {
			wp_enqueue_style('rtcl-bootstrap');
			wp_enqueue_style('rtcl-admin');
			wp_enqueue_script('rtcl-admin-listing-type');
			wp_localize_script('rtcl-admin-listing-type', 'rtcl', array(
				"ajaxurl" => $this->ajaxurl,
				"nonceId" => rtcl()->nonceId,
				"nonce"   => wp_create_nonce(rtcl()->nonceText)
			));
		}
	}

	function load_admin_script_ie_page() {
		if (!empty($_GET['post_type']) && $_GET['post_type'] == rtcl()->post_type && !empty($_GET['page']) && $_GET['page'] == 'rtcl-import-export') {
			wp_enqueue_style('rtcl-bootstrap');
			wp_enqueue_style('rtcl-admin');
			wp_enqueue_script('rtcl-xlsx', rtcl()->get_assets_uri("vendor/xlsx.full.min.js"), array('jquery'),
				$this->version, true);
			wp_enqueue_script('rtcl-xml2json', rtcl()->get_assets_uri("vendor/xml2json.min.js"), array('jquery'),
				$this->version, true);
			wp_enqueue_script('rtcl-admin-ie');
			wp_localize_script('rtcl-admin-ie', 'rtcl', array(
				"ajaxurl"       => $this->ajaxurl,
				rtcl()->nonceId => wp_create_nonce(rtcl()->nonceText)
			));
		}
	}

	function load_admin_script_post_type_listing() {
		global $pagenow, $post_type;
		// validate page
		if (!in_array($pagenow, array('post.php', 'post-new.php', 'edit.php'))) {
			return;
		}
		if (rtcl()->post_type != $post_type) {
			return;
		}
		wp_enqueue_script('jquery');
		wp_enqueue_script('jquery-ui-core');
		wp_enqueue_script('jquery-ui-datepicker');
		wp_enqueue_script('daterangepicker');
		wp_enqueue_script('rtcl-timepicker');
		wp_enqueue_script('jquery-ui-dialog');
		wp_enqueue_script('rtcl-validator');
		wp_enqueue_script('rt-field-dependency');
		wp_enqueue_script('select2');
		wp_enqueue_script('rtcl-admin');
		wp_enqueue_script('rtcl-gallery');
		wp_enqueue_script('plupload-all');
		wp_enqueue_script('suggest');
		wp_enqueue_style('jquery-ui');
		wp_enqueue_style('wp-jquery-ui-dialog');
		wp_enqueue_style('rtcl-bootstrap');
		wp_enqueue_style('rtcl-admin');

	}

	function load_admin_script_payment() {
		global $pagenow, $post_type;
		// validate page
		if (!in_array($pagenow, array('post.php', 'post-new.php', 'edit.php'))) {
			return;
		}
		if (rtcl()->post_type_payment != $post_type) {
			return;
		}
		wp_enqueue_script('jquery');
		wp_enqueue_style('rtcl-admin');
		wp_enqueue_script('rtcl-validator');
		wp_enqueue_script('select2');
		wp_enqueue_script('rtcl-admin');
	}

	function load_admin_script_pricing() {
		global $pagenow, $post_type;
		// validate page
		if (!in_array($pagenow, array('post.php', 'post-new.php', 'edit.php'))) {
			return;
		}
		if (rtcl()->post_type_pricing != $post_type) {
			return;
		}

		wp_enqueue_style('rtcl-bootstrap');
		wp_enqueue_style('rtcl-admin');

		wp_enqueue_script('select2');
		wp_enqueue_script('rtcl-validator');
		wp_enqueue_script('rtcl-admin');
	}

	function load_admin_script_taxonomy() {
		global $pagenow, $post_type;
		// validate page
		if (!in_array($pagenow, array('term.php', 'edit-tags.php'))) {
			return;
		}
		if (rtcl()->post_type != $post_type) {
			return;
		}
		wp_enqueue_media();
		wp_enqueue_style('rtcl-admin');
		wp_enqueue_script('select2');
		wp_enqueue_script('rtcl-admin-taxonomy');
	}

	/**
	 * @param $hook
	 */
	function load_script_at_widget_settings($hook) {
		if ('widgets.php' !== $hook) {
			return;
		}
		wp_enqueue_style('rtcl-admin');
		wp_enqueue_script('rtcl-admin-widget');
	}


	private static function localize_script($handle) {
		if (!in_array($handle, self::$wp_localize_scripts, true)) {
			$data = self::get_script_data($handle);

			if (!$data) {
				return;
			}

			$name = str_replace('-', '_', $handle) . '_localized_params';
			self::$wp_localize_scripts[] = $handle;
			wp_localize_script($handle, $name, apply_filters($name, $data));
		}
	}

	/**
	 * Return data for script handles.
	 *
	 * @param string $handle Script handle the data will be attached to.
	 *
	 * @return array|bool
	 */
	private static function get_script_data($handle) {

		switch ($handle) {
			case 'rtcl-public':
				$params = array();
				break;
			case 'rtcl-single-listing':
				$params = array(
					'slider_options' => apply_filters(
						'rtcl_single_listing_slider_options', array(
							'rtl' => is_rtl()
						)
					),
					'slider_enabled' => Functions::is_gallery_slider_enabled(),
				);
				break;
			default:
				$params = false;
		}

		return apply_filters('rtcl_get_script_data', $params, $handle);
	}

}
