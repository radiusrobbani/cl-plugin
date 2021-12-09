<?php

namespace Rtcl\Controllers\Hooks;

use Rtcl\Helpers\Functions;
use Rtcl\Models\Payment;

class ActionHooks
{
	public static function init() {
		add_action('rtcl_checkout_process_success', [__CLASS__, 'checkout_process_mail']);

		add_action('ajax_query_attachments_args', [__CLASS__, 'remove_ajax_query_attachments_args']);
		add_action('load-upload.php', [__CLASS__, 'remove_attachments_load_media']);

		add_action('rtcl_set_local', [__CLASS__, 'wpml_set_local_ajax']);
	}

	public static function wpml_set_local_ajax($current_lang) {
		if (!defined('DOING_AJAX') || !DOING_AJAX || !defined('ICL_SITEPRESS_VERSION')) {
			return;
		}
		global $sitepress;
		$current_lang = $current_lang ? $current_lang : (isset($_GET['lang']) ? $_GET['lang'] : '');
		if ($sitepress && method_exists($sitepress, 'switch_lang') && $current_lang !== $sitepress->get_default_language()) {
			$sitepress->switch_lang($current_lang, true); // Alternative do_action( 'wpml_switch_language', $_GET['lang'] );
		}
	}

	/**
	 * @param Payment $payment
	 */
	public static function checkout_process_mail($payment) {
		if ($payment && $payment->exists()) {
			if (Functions::get_option_item('rtcl_email_settings', 'notify_admin', 'order_created', 'multi_checkbox')) {
				rtcl()->mailer()->emails['Order_Created_Email_To_Admin']->trigger($payment->get_id(), $payment);
			}

			if (Functions::get_option_item('rtcl_email_settings', 'notify_users', 'order_created', 'multi_checkbox')) {
				rtcl()->mailer()->emails['Order_Created_Email_To_Customer']->trigger($payment->get_id(), $payment);
			}
		}
	}

	public static function remove_attachments_load_media() {
		add_action('pre_get_posts', [__CLASS__, 'hide_media'], 10, 1);
	}

	/**
	 * @param $query \WP_Query
	 *
	 * @return mixed
	 */
	public static function remove_ajax_query_attachments_args($query) {
		if ($query['post_type'] == 'attachment') {
			if (!empty($excluded_ids = Functions::all_ids_for_remove_attachment())) {
				$query['post_parent__not_in'] = $excluded_ids;
			}
		}

		return $query;
	}

	/**
	 * @param $query \WP_Query
	 *
	 * @return mixed
	 */
	public static function hide_media($query) {
		global $pagenow;

		// there is no need to check for update.php as we are already hooking to it, but anyway
		if ('upload.php' == $pagenow && is_admin() && $query->is_main_query()) {
			if (!empty($excluded_ids = Functions::all_ids_for_remove_attachment())) {
				$query->set('post_parent__not_in', $excluded_ids);
			}
		}

		return $query;
	}
}
