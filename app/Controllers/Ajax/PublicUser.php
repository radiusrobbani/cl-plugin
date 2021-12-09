<?php

namespace Rtcl\Controllers\Ajax;


use Rtcl\Controllers\Hooks\Comments;
use Rtcl\Controllers\Hooks\Filters;
use Rtcl\Helpers\Functions;
use Rtcl\Helpers\Link;
use Rtcl\Helpers\Text;
use Rtcl\Models\Cipher;
use Rtcl\Resources\Options;
use WP_Term;

class PublicUser
{

	public function __construct() {
		add_action("wp_ajax_rtcl_post_new_listing", [$this, 'rtcl_post_new_listing']);
		add_action('wp_ajax_rtcl_get_one_level_category_select_list', [$this, 'rtcl_get_one_level_category_select_list']);
		add_action('wp_ajax_rtcl_get_one_level_category_select_list_by_type', array(
			$this,
			'rtcl_get_one_level_category_select_list_by_type'
		));

		if (!is_user_logged_in() && Functions::is_enable_post_for_unregister()) {
			add_action("wp_ajax_nopriv_rtcl_post_new_listing", array($this, 'rtcl_post_new_listing'));

			add_action('wp_ajax_nopriv_rtcl_get_one_level_category_select_list', array(
				$this,
				'rtcl_get_one_level_category_select_list'
			));
			add_action('wp_ajax_nopriv_rtcl_get_one_level_category_select_list_by_type', array(
				$this,
				'rtcl_get_one_level_category_select_list_by_type'
			));
		}
		add_action("wp_ajax_rtcl_delete_listing", [$this, 'rtcl_delete_listing']);
		add_action('wp_ajax_rtcl_public_add_remove_favorites', [$this, 'rtcl_add_remove_favorites']);

		add_action('wp_ajax_rtcl_public_report_abuse', [$this, 'rtcl_report_abuse']);
		add_action('wp_ajax_nopriv_rtcl_public_report_abuse', [$this, 'rtcl_report_abuse']);
		add_action('wp_ajax_rtcl_public_send_contact_email', [$this, 'send_contact_email']);
		add_action('wp_ajax_nopriv_rtcl_public_send_contact_email', [&$this, 'send_contact_email']);

		// get dropdown terms
		add_action('wp_ajax_rtcl_child_dropdown_terms', [$this, 'dropdown_terms']);
		add_action('wp_ajax_nopriv_rtcl_child_dropdown_terms', [$this, 'dropdown_terms']);

		add_action('wp_ajax_rtcl_update_user_account', [$this, 'rtcl_update_user_account']);

		// Comment
		add_action('wp_ajax_rtcl_ajax_submit_comment', [__CLASS__, 'rtcl_ajax_submit_comment']);
		add_action('wp_ajax_nopriv_rtcl_ajax_submit_comment', [__CLASS__, 'rtcl_ajax_submit_comment']);

		// From request
		add_action('wp_ajax_nopriv_rtcl_login_request', [__CLASS__, 'rtcl_login_request_handler']);
		add_action('wp_ajax_nopriv_rtcl_registration_request', [__CLASS__, 'rtcl_registration_request_handler']);

		// profile Picture upload
		add_action('wp_ajax_rtcl_ajax_user_profile_picture_upload', [__CLASS__, 'profile_picture_upload']);
		add_action('wp_ajax_rtcl_ajax_user_profile_picture_delete', [__CLASS__, 'profile_picture_delete']);
	}

	public static function profile_picture_delete() {
		$message = null;
		if (Functions::verify_nonce() && $user_id = get_current_user_id()) {
			$pp_id = absint(get_user_meta($user_id, '_rtcl_pp_id', true));
			if ($pp_id && wp_delete_attachment($pp_id)) {
				delete_user_meta($user_id, '_rtcl_pp_id');
				wp_send_json_success(esc_html__("Successfully deleted", "classified-listing"));
			} else {
				$message = esc_html__("File could not be deleted.", "classified-listing");
			}
		} else {
			$message = esc_html__("Authentication error!!", "classified-listing");
		}
		wp_send_json_error($message);
	}

	public static function profile_picture_upload() {
		$msg = null;
		if (Functions::verify_nonce() && isset($_FILES['pp']) && $user_id = get_current_user_id()) {
			Filters::beforeUpload();
			$status = wp_handle_upload($_FILES['pp'], ['test_form' => false]);
			Filters::afterUpload();
			if ($status && !isset($status['error'])) {
				// $filename should be the path to a file in the upload directory.
				$filename = $status['file'];
				// Check the type of tile. We'll use this as the 'post_mime_type'.
				$fileType = wp_check_filetype(basename($filename), null);

				// Get the path to the upload directory.
				$wp_upload_dir = wp_upload_dir();

				// Prepare an array of post data for the attachment.
				$attachment = array(
					'guid'           => $wp_upload_dir['url'] . '/' . basename($filename),
					'post_mime_type' => $fileType['type'],
					'post_title'     => preg_replace('/\.[^.]+$/', '', basename($filename)),
					'post_content'   => '',
					'post_status'    => 'inherit'
				);


				// Insert the attachment.
				$attach_id = wp_insert_attachment($attachment, $filename);
				if (!is_wp_error($attach_id)) {
					if ($existing_pp = get_user_meta($user_id, '_rtcl_pp_id', true)) {
						wp_delete_attachment($existing_pp, true);
					}
					update_user_meta($user_id, '_rtcl_pp_id', $attach_id);
					wp_update_attachment_metadata($attach_id, wp_generate_attachment_metadata($attach_id, $filename));
					$src = wp_get_attachment_image_src($attach_id);
					$data = array(
						'pp_id'   => $attach_id,
						'src'     => $src[0],
						'message' => esc_html__("Successfully updated.", "classified-listing")
					);
					do_action('rtcl_user_pp_updated', $data, $user_id, $attach_id, $_REQUEST);
					wp_send_json_success($data);
				}
			} else {
				$msg = $status['error'];
			}
		} else {
			$msg = esc_html__("Authentication error!!", "classified-listing");
		}
		wp_send_json_error($msg);

	}

	public static function rtcl_registration_request_handler() {
		if (!Functions::verify_nonce()) {
			wp_send_json_error(esc_html__("Session Expired!!", "classified-listing"));
		}
		$username = isset($_POST['username']) ? trim($_POST['username']) : '';
		$password = isset($_POST['password']) ? trim($_POST['password']) : '';
		$email = isset($_POST['email']) ? $_POST['email'] : '';
		$args = [];
		if (!empty($_POST['first_name'])) {
			$args['first_name'] = $_POST['first_name'];
		}
		if (!empty($_POST['last_name'])) {
			$args['last_name'] = $_POST['last_name'];
		}
		if (!empty($_POST['phone'])) {
			$args['phone'] = $_POST['phone'];
		}

		try {
			$validation_error = new \WP_Error();
			$validation_error = apply_filters('rtcl_process_registration_errors', $validation_error, $email, $username, $password, $_POST);

			if ($validation_error->get_error_code()) {
				throw new \Exception($validation_error->get_error_message());
			}

			$new_user_id = Functions::create_new_user(sanitize_email($email), Functions::clean($username), $password, $args);

			if (is_wp_error($new_user_id)) {
				throw new \Exception($new_user_id->get_error_message());
			}

			if (!empty($_POST['redirect_to'])) {
				$redirect = wp_sanitize_redirect($_POST['redirect_to']);
			} elseif (Functions::get_raw_referer()) {
				$redirect = Functions::get_raw_referer();
			} else {
				$redirect = Link::get_page_permalink('myaccount');
			}


			if (!apply_filters('rtcl_registration_need_auth_new_user', false, $new_user_id)) {
				Functions::set_customer_auth_cookie($new_user_id);
				$message = esc_html__("You have successfully registered.", 'classified-listing');
			} else {
				$redirect = '';
				$message = esc_html__('You have successfully registered on our website, Please check your email and click on the link, we sent a verification mail to verify your email address.', 'classified-listing');
			}


			wp_send_json_success(apply_filters('rtcl_registration_request_success_data', [
				'redirect_url' => wp_validate_redirect(apply_filters('rtcl_login_redirect', $redirect, $_POST)),
				'message'      => $message
			], $new_user_id, $_POST));

		} catch (\Exception $e) {
			wp_send_json_error(apply_filters('rtcl_registration_request_error_data', $e->getMessage(), $_POST));
		}
	}

	public static function rtcl_login_request_handler() {
		$validation_error = new \WP_Error();

		if (!Functions::verify_nonce()) {
			$validation_error->add('rtcl_session_error', esc_html__("Session Expired!!", "classified-listing"));
		}
		$creds = array(
			'user_login'    => Cipher::decrypt($_POST['username'], $_POST['__rtcl_wpnonce']),
			'user_password' => Cipher::decrypt($_POST['password'], $_POST['__rtcl_wpnonce']),
			'remember'      => isset($_POST['rememberme']),
		);
		$validation_error = apply_filters('rtcl_process_login_errors', $validation_error, $_POST['username'], $_POST['password'], $_POST);

		if (is_wp_error($validation_error) && !empty($validation_error->errors)) {
			$error = apply_filters('wp_login_errors', $validation_error, '');
			wp_send_json_error(apply_filters('rtcl_login_request_error', $error->get_error_message(), $error));
		}
		if (is_multisite()) {
			$user_data = get_user_by(is_email($creds['user_login']) ? 'email' : 'login', $creds['user_login']);

			if ($user_data && !is_user_member_of_blog($user_data->ID, get_current_blog_id())) {
				add_user_to_blog(get_current_blog_id(), $user_data->ID, 'customer');
			}
		}

		$user = wp_signon(apply_filters('rtcl_login_credentials', $creds, $_POST), is_ssl());

		if (is_wp_error($user) && !empty($user->errors)) {
			$error = apply_filters('wp_login_errors', $user, '');
			wp_send_json_error(apply_filters('rtcl_login_request_error', $error->get_error_message(), $error));
		}

		if (!empty($_POST['redirect_to'])) {
			$redirect = $_POST['redirect_to'];
		} elseif (Functions::get_raw_referer()) {
			$redirect = Functions::get_raw_referer();
		} else {
			$redirect = Link::get_my_account_page_link();
		}

		wp_send_json_success(apply_filters('rtcl_login_request_success_data', [
			'redirect_url' => wp_validate_redirect(apply_filters('rtcl_login_redirect', $redirect, $user, $_POST)),
			'message'      => esc_html__("You have successfully logged in.", 'classified-listing')
		], $user, $_POST));
	}


	public static function rtcl_ajax_submit_comment() {
		$message = $comment_html = $comment_id = null;
		$error = $comment = false;
		if (is_user_logged_in()) {
			$current_user_id = get_current_user_id();
			$post = get_post(absint($_POST['comment_post_ID']));
			if ($post->post_author == $current_user_id) {
				$error = true;
				$message = esc_html__("Ad author can't post rating.", 'classified-listing');
			} else {
				$args = array(
					'post_type' => rtcl()->post_type,
					'post_id'   => $_POST['comment_post_ID'],
					'user_id'   => $current_user_id,
					'number'    => 1,
					'parent'    => 0,
				);
				$comment_exist = get_comments($args);

				if (count($comment_exist) > 0) {
					if (Functions::get_option_item('rtcl_moderation_settings', 'enable_update_rating', '', 'checkbox')) {
						$title = sanitize_text_field($_POST['title']);
						$comment_text = esc_textarea($_POST['comment']);
						$rating = (isset($_POST['rating']) && absint($_POST['rating']) <= 5 && absint($_POST['rating']) >= 1) ? absint($_POST['rating']) : 0;
						if ($title && $comment_text && $rating) {
							$comment = array();
							$comment['comment_ID'] = $comment_exist[0]->comment_ID;
							$comment['comment_content'] = $comment_text;
							wp_update_comment($comment);

							update_comment_meta($comment_exist[0]->comment_ID, 'rating', $rating);
							update_comment_meta($comment_exist[0]->comment_ID, 'title', $title);
							Comments::clear_transients($post->ID);
							$comment = get_comment($comment_exist[0]->comment_ID);
							$message = esc_html__("Your rating has been updated.", 'classified-listing');
						} else {
							$error = true;
							$message = esc_html__("Please add the required field.", 'classified-listing');
						}
					} else {
						$error = true;
						$message = esc_html__("You have already a review.", 'classified-listing');
					}
				}
			}
		} else {
			if (isset($_POST['email']) && is_string($_POST['email'])) {
				$comment_author_email = trim($_POST['email']);
			}
			if ($comment_author_email) {
				$args = array(
					'post_type'    => rtcl()->post_type,
					'post_id'      => $_POST['comment_post_ID'],
					'author_email' => $comment_author_email,
					'number'       => 1,
					'parent'       => 0,
				);
				$comment_exist = get_comments($args);
				if (count($comment_exist) > 0) {
					if (Functions::get_option_item('rtcl_moderation_settings', 'enable_update_rating', '', 'checkbox')) {

						$title = sanitize_text_field($_POST['title']);
						$comment_text = esc_textarea($_POST['comment']);
						$rating = (isset($_POST['rating']) && absint($_POST['rating']) <= 5 && absint($_POST['rating']) >= 1) ? absint($_POST['rating']) : 0;
						if ($title && $comment_text && $rating) {
							$comment = array();
							$comment['comment_ID'] = $comment_exist[0]->comment_ID;
							$comment['comment_content'] = $comment_text;
							wp_update_comment($comment);

							update_comment_meta($comment_exist[0]->comment_ID, 'rating', $rating);
							update_comment_meta($comment_exist[0]->comment_ID, 'title', $title);
							Comments::clear_transients($_POST['comment_post_ID']);
							$comment = get_comment($comment_exist[0]->comment_ID);
							$message = esc_html__("Your rating has been updated.", 'classified-listing');
						} else {
							$error = true;
							$message = esc_html__("Please add the required field.", 'classified-listing');
						}
					} else {
						$error = true;
						$message = esc_html__("You have already a review.", 'classified-listing');
					}
				}
			} else {
				$error = true;
				$message = esc_html__("Please add the required field.", 'classified-listing');
			}
		}

		if ($comment || $error) {

			if ($comment) {
				/*
				 * Set Cookies
				 */
				$user = wp_get_current_user();
				do_action('set_comment_cookies', $comment, $user);

				/*
				 * If you do not like this loop, pass the comment depth from JavaScript code
				 */
				$comment_depth = 1;
				$comment_parent = $comment->comment_parent;
				while ($comment_parent) {
					$comment_depth++;
					$parent_comment = get_comment($comment_parent);
					$comment_parent = $parent_comment->comment_parent;

				}

				/*
				 * Set the globals, so our comment functions below will work correctly
				 */
				$GLOBALS['comment'] = $comment;
				$GLOBALS['comment_depth'] = $comment_depth;
				$comment_id = $comment->comment_ID;
				/*
				 * Here is the comment template, you can configure it for your website
				 * or you can try to find a ready function in your theme files
				 */
				$comment_html = Functions::get_template_html('listing/review', array('comment' => $comment));
			}
			wp_send_json(array(
				'comment_html' => $comment_html,
				'message'      => $message,
				'error'        => $error,
				'comment_id'   => $comment_id,
			));
		}

		$comment = wp_handle_comment_submission(wp_unslash($_POST));
		if (is_wp_error($comment)) {
			$error = true;
			$error_data = intval($comment->get_error_data());
			if (!empty($error_data)) {
				$message = $comment->get_error_message();
			} else {
				$message = esc_html__('Unknown error', 'classified-listing');
			}

		} else {
			$message = esc_html__("Successfully posted", "classified-listing");
			/*
			 * Set Cookies
			 */
			$user = wp_get_current_user();
			do_action('set_comment_cookies', $comment, $user);

			/*
			 * If you do not like this loop, pass the comment depth from JavaScript code
			 */
			$comment_depth = 1;
			$comment_parent = $comment->comment_parent;
			while ($comment_parent) {
				$comment_depth++;
				$parent_comment = get_comment($comment_parent);
				$comment_parent = $parent_comment->comment_parent;

			}

			/*
			 * Set the globals, so our comment functions below will work correctly
			 */
			$GLOBALS['comment'] = $comment;
			$GLOBALS['comment_depth'] = $comment_depth;
			$comment_id = $comment->comment_ID;
			/*
			 * Here is the comment template, you can configure it for your website
			 * or you can try to find a ready function in your theme files
			 */
			$comment_html = Functions::get_template_html('listing/review', array('comment' => $comment));
		}


		wp_send_json(array(
			'comment_html' => $comment_html,
			'message'      => $message,
			'error'        => $error,
			'comment_id'   => $comment_id,
		));
	}

	public function rtcl_update_user_account() {
		$error = true;
		$msg = array();
		$user_id = get_current_user_id();
		$first_name = sanitize_text_field($_POST['first_name']);
		$last_name = sanitize_text_field($_POST['last_name']);

		// Validate email
		$email = sanitize_email($_POST['email']);
		$errors = new \WP_Error();

		if (!is_email($email)) {
			$errors->add('rtcl_invalid_email', esc_html__("Invalid email address.", 'classified-listing'));
		}

		if ($id = email_exists($email)) {
			if ($id !== $user_id) {
				$errors->add('rtcl_email_exist', esc_html__("Sorry, that email address already exists!", 'classified-listing'));
			}
		}

		// Validate password
		$password = '';

		if (isset($_POST['change_password']) && $_POST['change_password'] == 1) {
			$password = sanitize_text_field($_POST['pass1']);
			if (empty($password)) {
				// Password is empty
				$errors->add('rtcl_my_account_password_empty', esc_html__('The password field is empty.', 'classified-listing'));
			}

			if ($password != $_POST['pass2']) {
				// Passwords don't match
				$errors->add('rtcl_my_account_password_not_matched', esc_html__("The two passwords you entered don't match.", 'classified-listing'));
			}
			do_action('rtcl_my_account_validate_password_reset', $errors, $password);
		}


		// Generate the password so that the subscriber will have to check email...
		$user_data = array(
			'ID'         => $user_id,
			'user_email' => $email,
			'first_name' => $first_name,
			'last_name'  => $last_name,
			'nickname'   => $first_name
		);

		do_action('rtcl_my_account_validate_user_data', $errors, $user_data);

		if (is_wp_error($errors) && $errors->has_errors()) {
			wp_send_json(array(
				'error'   => $error,
				'message' => $errors->get_error_message(),
			));
		}

		if (!empty($password)) {
			$user_data['user_pass'] = $password;
		}
		if (empty($msg)) {
			$user_id = wp_update_user($user_data);
			$user_meta = array();

			$user_meta['_rtcl_phone'] = !empty($_POST['phone']) ? esc_attr($_POST['phone']) : null;
			$user_meta['_rtcl_whatsapp_number'] = !empty($_POST['whatsapp_number']) ? esc_attr($_POST['whatsapp_number']) : null;
			$user_meta['_rtcl_website'] = !empty($_POST['website']) ? esc_url_raw($_POST['website']) : null;
			$user_meta['_rtcl_zipcode'] = !empty($_POST['zipcode']) ? esc_attr($_POST['zipcode']) : null;
			$user_meta['_rtcl_address'] = !empty($_POST['address']) ? esc_textarea($_POST['address']) : null;
			$location = [];
			if (!empty($_POST['location']) && $state = absint($_POST['location'])) {
				array_push($location, $state);
			}
			if (!empty($_POST['sub_location']) && $city = absint($_POST['sub_location'])) {
				array_push($location, $city);
			}
			if (!empty($_POST['sub_sub_location']) && $town = absint($_POST['sub_sub_location'])) {
				array_push($location, $town);
			}
			$user_meta['_rtcl_location'] = $location;
			$user_meta = apply_filters('rtcl_update_user_account_data', $user_meta, $user_id, $_POST);

			if (!empty($user_meta)) {
				foreach ($user_meta as $metaKey => $metaValue) {
					update_user_meta($user_id, $metaKey, $metaValue);
				}
			}

			$error = false;
			$msg = esc_html__("Your account has been updated.", "classified-listing");
		}
		if (is_array($msg) && count($msg)) {
			$m = null;
			foreach ($msg as $message) {
				$m .= sprintf("<p>%s</p>", $message);
			}
			$msg = $m;
		}
		do_action('rtcl_update_user_account', $user_id, $_POST);
		wp_send_json(array(
			'error'   => $error,
			'message' => $msg,
		));
	}

	public function dropdown_terms() {

		if (isset($_POST['taxonomy']) && isset($_POST['parent'])) {

			$args = array(
				'taxonomy'  => sanitize_text_field($_POST['taxonomy']),
				'base_term' => 0,
				'parent'    => (int)$_POST['parent']
			);

			if (isset($_POST['class']) && '' != trim($_POST['class'])) {
				$args['class'] = sanitize_text_field($_POST['class']);
			}

			if ($args['parent'] != $args['base_term']) {
				ob_start();
				Functions::dropdown_terms($args);
				$output = ob_get_clean();
				echo $output;
			}

		}

		wp_die();

	}

	function send_contact_email() {

		$data = array('error' => 1);
		$post_id = (int)$_POST["post_id"];
		$name = sanitize_text_field($_POST["name"]);
		$email = sanitize_email($_POST["email"]);
		$message = stripslashes(wp_kses(nl2br($_POST["message"]), [
			'a'      => [
				'href'  => true,
				'title' => true,
			],
			'br'     => [],
			'ul'     => [],
			'ol'     => [],
			'li'     => [],
			'strong' => []
		]));


		if (is_object(get_post($post_id)) && $name && $email && $message) {
			if (Functions::is_human('contact')) {

				$sender_data = array(
					'name'    => $name,
					'email'   => $email,
					'message' => $message
				);

				if (!Functions::get_option_item('rtcl_email_settings', 'notify_users', 'disable_contact_email', 'multi_checkbox')) {
					rtcl()->mailer()->emails['Listing_Contact_Email_To_Owner']->trigger($post_id, $sender_data);
				}
				if (Functions::get_option_item('rtcl_email_settings', 'notify_admin', 'listing_contact', 'multi_checkbox')) {
					rtcl()->mailer()->emails['Listing_Contact_Email_To_Admin']->trigger($post_id, $sender_data);
				}
				$notification = absint(get_post_meta($post_id, '_notification_by_visitor', true)) + 1;
				update_post_meta($post_id, '_notification_by_visitor', $notification);
				$data['error'] = 0;
				$data['message'] = esc_html__('Your message sent successfully.', 'classified-listing');

			} else {
				$data['message'] = esc_html__('Invalid Captcha: Please try again.', 'classified-listing');
			}
		} else {
			$data['message'] = esc_html__('Need to fill all the required field.', 'classified-listing');
		}

		wp_send_json($data);
	}

	function rtcl_delete_listing() {
		$success = false;
		$message = $msg_class = $redirect_url = $post_id = null;
		if (Functions::verify_nonce()) {
			$post_id = absint(Functions::request('post_id'));
			if ($post_id && Functions::current_user_can('delete_' . rtcl()->post_type, $post_id)) {
				$children = get_children(apply_filters('rtcl_before_delete_listing_attachment_query_args', [
					'post_parent'    => $post_id,
					'post_type'      => 'attachment',
					'posts_per_page' => -1,
					'post_status'    => 'inherit',
				], $post_id));
				if (!empty($children)) {
					foreach ($children as $child) {
						wp_delete_attachment($child->ID, true);
					}
				}

				do_action('rtcl_before_delete_listing', $post_id);
				Functions::delete_post($post_id);
				$success = true;
				$message .= esc_html__("Successfully deleted.", "classified-listing");
				$redirect_url = Link::get_account_endpoint_url("listings");
			} else {
				$message .= esc_html__("Permission Error.", "classified-listing");
			}
		} else {
			$message .= esc_html__("Session expired.", "classified-listing");
		}

		wp_send_json(apply_filters('rtcl_delete_listing_ajax_response', [
			'success'      => $success,
			'post_id'      => $post_id,
			'message'      => $message,
			'redirect_url' => $redirect_url
		]));
	}

	function rtcl_report_abuse() {
		$data = array('error' => 1);
		$post_id = (int)$_POST["post_id"];
		$message = esc_textarea($_POST["message"]);
		if (is_object(get_post($post_id)) && $message) {
			if (Functions::is_human('report_abuse')) {
				$sender_data = array(
					'message' => $message
				);
				$is_send = rtcl()->mailer()->emails['Report_Abuse_Email_To_Admin']->trigger($post_id, $sender_data);
				if ($is_send) {

					$notification = absint(get_post_meta($post_id, '_abuse_report_by_visitor', true)) + 1;
					update_post_meta($post_id, '_abuse_report_by_visitor', $notification);
					$data['error'] = 0;
					$data['message'] = esc_html__('Your message sent successfully.', 'classified-listing');

				} else {
					$data['message'] = esc_html__('Sorry! Please try again.', 'classified-listing');
				}

			} else {
				$data['message'] = esc_html__('Invalid Captcha: Please try again.', 'classified-listing');

			}
		} else {
			$data['message'] = esc_html__('Need to fill all the required field.', 'classified-listing');
		}

		wp_send_json($data);
	}

	function rtcl_add_remove_favorites() {
		$success = false;
		$message = null;
		$action = null;
		$post_id = !empty($_POST['post_id']) ? absint($_POST['post_id']) : 0;
		if (Functions::verify_nonce()) {
			if ($post_id) {
				$favourites = (array)get_user_meta(get_current_user_id(), 'rtcl_favourites', true);

				if (in_array($post_id, $favourites)) {
					if (($key = array_search($post_id, $favourites)) !== false) {
						unset($favourites[$key]);
						$action = 'removed';
					}
				} else {
					$favourites[] = $post_id;
					$action = 'added';
				}

				$favourites = array_filter($favourites);
				$favourites = array_values($favourites);
				update_user_meta(get_current_user_id(), 'rtcl_favourites', $favourites);
				$success = true;
				$message = esc_html__("Successfully removed", "classified-listing");
			} else {
				$message = esc_html__("Add post id to remove", "classified-listing");
			}
		} else {
			$message = esc_html__("Session Expired!", "classified-listing");
		}
		wp_send_json(array(
			"success" => $success,
			"post_id" => $post_id,
			"action"  => $action,
			"html"    => Functions::get_favourites_link($post_id),
			"message" => $message
		));
	}

	function rtcl_post_new_listing() {
		Functions::clear_notices();// Clear previous notice
		$success = false;
		$post_id = 0;
		$type = 'new';
		if (Functions::verify_nonce()) {
			$agree = isset($_POST['rtcl_agree']) ? 1 : null;
			if (Functions::is_enable_terms_conditions() && !$agree) {
				Functions::add_notice(
					apply_filters('rtcl_listing_form_terms_conditions_text_responses', esc_html__("Please agree with the terms and conditions.", "classified-listing"), $_REQUEST),
					'error');
			} else {
				$raw_cat_id = isset($_POST['_category_id']) ? absint($_POST['_category_id']) : 0;
				$listing_type = isset($_POST['_ad_type']) && in_array($_POST['_ad_type'], array_keys(Functions::get_listing_types())) ? esc_attr($_POST['_ad_type']) : '';
				$post_id = absint(Functions::request('_post_id'));
				if (!$raw_cat_id && !$post_id) {
					Functions::add_notice(
						apply_filters('rtcl_listing_form_category_not_select_responses',
							sprintf(
								esc_html__('Category not selected. <a href="%s">Click here to set category</a>', "classified-listing"),
								Link::get_listing_form_page_link()
							)
						), 'error');
				} else {
					// Check if user has not any post remaining
					do_action('rtcl_before_add_edit_listing_before_category_condition', $post_id);
					$category_id = 0;
					if (Functions::is_gallery_image_required() && (!$post_id || !count(Functions::get_listing_images($post_id)))) {
						Functions::add_notice(esc_html__('Image is required. Please select an image.', 'classified-listing'), 'error', 'rtcl_listing_gallery_image_required');
					}
					if (!Functions::notice_count('error')) {
						if ((!$post_id || (($post = get_post($post_id)) && $post->post_type == rtcl()->post_type) && $post->post_status = "rtcl-temp") && $raw_cat_id) {
							$category = get_term_by('id', $raw_cat_id, rtcl()->category);
							if (is_a($category, WP_Term::class)) {
								$category_id = $category->term_id;
								$parent_id = Functions::get_term_top_most_parent_id($category_id, rtcl()->category);
								if (Functions::term_has_children($category_id)) {
									Functions::add_notice(esc_html__("Please select ad type and category", "classified-listing"), 'error');
								}
								if (!Functions::is_ad_type_disabled() && !$listing_type) {
									Functions::add_notice(esc_html__("Please select an ad type", "classified-listing"), 'error');
								}
								$cats_on_type = wp_list_pluck(Functions::get_one_level_categories(0, $listing_type), 'term_id');
								if (!in_array($parent_id, $cats_on_type)) {
									Functions::add_notice(esc_html__("Please select correct type and category", "classified-listing"), 'error');
								}
								do_action('rtcl_before_add_edit_listing_into_category_condition', $post_id, $category_id);
							} else {
								Functions::add_notice(esc_html__("Category is not valid", "classified-listing"), 'error');
							}
						}
						if (!$post_id && !$category_id) {
							Functions::add_notice(__("Category not selected", "classified-listing"), 'error');
						}
					}
					if (!Functions::notice_count('error')) {
						$cats = array($category_id);

						$meta = [];
						if (Functions::is_enable_terms_conditions() && $agree) {
							$meta['rtcl_agree'] = 1;
						}
						if (isset($_POST['_rtcl_listing_pricing']) && $listing_pricing_type = sanitize_text_field($_POST['_rtcl_listing_pricing'])) {
							$meta['_rtcl_listing_pricing'] = in_array($listing_pricing_type, array_keys(Options::get_listing_pricing_types())) ? $listing_pricing_type : 'price';;
							if (isset($_POST['_rtcl_max_price']) && 'range' === $listing_pricing_type) {
								$meta['_rtcl_max_price'] = Functions::format_decimal($_POST['_rtcl_max_price']);
							}
						}
						if (isset($_POST['price_type'])) {
							$meta['price_type'] = Functions::sanitize($_POST['price_type']);
						}
						if (isset($_POST['price'])) {
							$meta['price'] = Functions::format_decimal($_POST['price']);
						}
						if (isset($_POST['_rtcl_price_unit'])) {
							$meta['_rtcl_price_unit'] = Functions::sanitize($_POST['_rtcl_price_unit']);
						}

						if (!Functions::is_video_urls_disabled() && isset($_POST['_rtcl_video_urls'])) {
							$meta['_rtcl_video_urls'] = Functions::sanitize($_POST['_rtcl_video_urls'], 'video_urls');
						}

						if ("google" === apply_filters('rtcl_location_type', 'local')) {
							if (isset($_POST['rtcl_geo_address'])) {
								$meta['_rtcl_geo_address'] = Functions::sanitize($_POST['rtcl_geo_address']);
							}
						} else {
							if (isset($_POST['zipcode'])) {
								$meta['zipcode'] = Functions::sanitize($_POST['zipcode']);
							}
							if (isset($_POST['address'])) {
								$meta['address'] = Functions::sanitize($_POST['address'], 'textarea');
							}
						}

						if (isset($_POST['phone'])) {
							$meta['phone'] = Functions::sanitize($_POST['phone']);
						}
						if (isset($_POST['_rtcl_whatsapp_number'])) {
							$meta['_rtcl_whatsapp_number'] = Functions::sanitize($_POST['_rtcl_whatsapp_number']);
						}
						if (isset($_POST['email'])) {
							$meta['email'] = Functions::sanitize($_POST['email'], 'email');
						}
						if (isset($_POST['website'])) {
							$meta['website'] = Functions::sanitize($_POST['website'], 'url');
						}
						if (isset($_POST['latitude'])) {
							$meta['latitude'] = Functions::sanitize($_POST['latitude']);
						}
						if (isset($_POST['longitude'])) {
							$meta['longitude'] = Functions::sanitize($_POST['longitude']);
						}

						$meta['hide_map'] = isset($_POST['hide_map']) ? 1 : null;
						$title = isset($_POST['title']) ? Functions::sanitize($_POST['title'], 'title') : '';
						$post_arg = array(
							'post_title'   => $title,
							'post_content' => isset($_POST['description']) ? Functions::sanitize($_POST['description'], 'content') : '',
						);
						$post = get_post($post_id);
						$user_id = get_current_user_id();
						$post_for_unregister = Functions::is_enable_post_for_unregister();
						if (!is_user_logged_in() && $post_for_unregister) {
							$new_user_id = Functions::do_registration_from_listing_form(['email' => $meta['email']]);
							if ($new_user_id && is_numeric($new_user_id)) {
								$user_id = $new_user_id;
								Functions::add_notice(apply_filters('rtcl_listing_new_registration_success_message', sprintf(__("A new account is registered, password is sent to your email(%s).", "classified-listing"), $meta['email']), $meta['email']));
							}
						}
						if ($user_id) {
							$new_listing_status = Functions::get_option_item('rtcl_moderation_settings', 'new_listing_status', 'pending');

							if ($post_id && is_object($post) && $post->post_type == rtcl()->post_type) {
								if (($post->post_author > 0 && $post->post_author == get_current_user_id()) || ($post->post_type == 0 && $post_for_unregister)) {
									if ($post->post_status === "rtcl-temp") {
										$post_arg['post_name'] = $title;
										$post_arg['post_status'] = $new_listing_status;
									} else {
										$type = 'update';
										$status_after_edit = Functions::get_option_item('rtcl_moderation_settings', 'edited_listing_status');
										if ("publish" === $post->post_status && $status_after_edit && $post->post_status !== $status_after_edit) {
											$post_arg['post_status'] = $status_after_edit;
										}
									}

									if ($post->post_author == 0 && $post_for_unregister) {
										$post_arg['post_author'] = $user_id;
									}
									$post_arg['ID'] = $post_id;
									$success = wp_update_post(apply_filters('rtcl_listing_save_update_args', $post_arg, $type));
								}

							} else {
								$post_arg['post_status'] = $new_listing_status;
								$post_arg['post_author'] = $user_id;
								$post_arg['post_type'] = rtcl()->post_type;
								$post_id = $success = wp_insert_post(apply_filters('rtcl_listing_save_update_args', $post_arg, $type));
							}

							if ($type == 'new' && $post_id) {
								wp_set_object_terms($post_id, $cats, rtcl()->category);
								$meta['ad_type'] = $listing_type;
							}
							if ("local" === apply_filters('rtcl_location_type', 'local')) {
								$locations = [];
								if ($loc = Functions::request('location')) {
									array_push($locations, absint($loc));
								}
								if ($loc = Functions::request('sub_location')) {
									array_push($locations, absint($loc));
								}
								if ($loc = Functions::request('sub_sub_location')) {
									array_push($locations, absint($loc));
								}
								wp_set_object_terms($post_id, $locations, rtcl()->location);
							}

							// Custom Meta field
							if (isset($_POST['rtcl_fields']) && $post_id) {
								foreach ($_POST['rtcl_fields'] as $key => $value) {
									$field_id = (int)str_replace('_field_', '', $key);
									if ($field = rtcl()->factory->get_custom_field($field_id)) {
										$field->saveSanitizedValue($post_id, $value);
									}
								}
							}

							/* meta data */
							if (!empty($meta) && $post_id) {
								foreach ($meta as $key => $value) {
									update_post_meta($post_id, $key, $value);
								}
							}

							// send emails
							if ($success && $post_id && ($listing = rtcl()->factory->get_listing($post_id))) {

								if ($type == 'new') {
									update_post_meta($post_id, 'featured', 0);
									update_post_meta($post_id, '_views', 0);
									$current_user_id = get_current_user_id();
									$ads = absint(get_user_meta($current_user_id, '_rtcl_ads', true));
									update_user_meta($current_user_id, '_rtcl_ads', $ads + 1);
									if ('publish' === $new_listing_status) {
										Functions::add_default_expiry_date($post_id);
									}
									Functions::add_notice(apply_filters('rtcl_listing_success_message', esc_html__("Thank you for submitting your ad!", "classified-listing"), $post_id, $type, $_REQUEST));

								} else if ($type == 'update') {
									Functions::add_notice(apply_filters('rtcl_listing_success_message', esc_html__("Successfully updated !!!", "classified-listing"), $post_id, $type, $_REQUEST));
								}

								do_action('rtcl_listing_form_after_save_or_update', $listing, $type, $category_id, $new_listing_status, [
									'data'  => $_REQUEST,
									'files' => $_FILES
								]);
							} else {
								Functions::add_notice(apply_filters('rtcl_listing_error_message', esc_html__("Error!!", "classified-listing"), $_REQUEST), 'error');
							}
						}
					}
				}
			}
		} else {
			Functions::add_notice(apply_filters('rtcl_listing_session_error_message', esc_html__("Session Error !!", "classified-listing"), $_REQUEST), 'error');
		}

		$message = Functions::get_notices('error');
		if ($success) {
			$message = Functions::get_notices('success');
		}
		Functions::clear_notices(); // Clear all notice created by checkin

		wp_send_json(apply_filters('rtcl_listing_form_after_save_or_update_responses', array(
			'message'      => $message,
			'success'      => $success,
			'post_id'      => $post_id,
			'type'         => $type,
			'redirect_url' => apply_filters('rtcl_listing_form_after_save_or_update_responses_redirect_url',
				Functions::get_listing_redirect_url_after_edit_post($type, $post_id, $success),
				$type, $post_id, $success, $message
			)
		)));
	}

	function rtcl_get_one_level_category_select_list() {
		Functions::clear_notices();
		$success = false;
		$message = array();
		$cat_id = isset($_POST['term_id']) ? absint($_POST['term_id']) : 0;
		$child_cats = null;
		if ($cat_id) {
			$success = true;
			$childCats = Functions::get_one_level_categories($cat_id);
			if (!empty($childCats)) {
				$child_cats .= sprintf("<option value=''>%s</option>", esc_html(Text::get_select_category_text()));
				foreach ($childCats as $child_cat) {
					$child_cats .= "<option value='{$child_cat->term_id}'>{$child_cat->name}</option>";
				}
			}
		} else {
			Functions::add_notice(__("Category not selected.", "classified-listing"), 'error');
		}
		if (Functions::notice_count('error')) {
			$message = Functions::get_notices('error');
		}
		Functions::clear_notices();
		$response = array(
			'message'    => $message,
			'success'    => $success,
			'child_cats' => $child_cats,
			'cat_id'     => $cat_id
		);
		wp_send_json(apply_filters('rtcl_ajax_category_selection_before_post', $response));
	}

	function rtcl_get_one_level_category_select_list_by_type() {
		Functions::clear_notices();
		$success = false;
		$message = array();
		$type = (isset($_POST['type']) && in_array($_POST['type'], array_keys(Functions::get_listing_types()))) ? $_POST['type'] : null;
		$child_cats = null;
		if ($type) {
			$childCats = Functions::get_one_level_categories(0, $type);
			if (!empty($childCats)) {
				$success = true;
				$child_cats .= sprintf("<option value=''>%s</option>", esc_html(Text::get_select_category_text()));
				foreach ($childCats as $child_cat) {
					$child_cats .= "<option value='{$child_cat->term_id}'>{$child_cat->name}</option>";
				}
			} else {
				Functions::add_notice(__("No category found.", "classified-listing"), 'error');
			}
		} else {
			Functions::add_notice(__("Type is not selected.", "classified-listing"), 'error');
		}
		if (Functions::notice_count('error')) {
			$message = Functions::get_notices('error');
		}
		Functions::clear_notices();
		$response = array(
			'message' => $message,
			'success' => $success,
			'cats'    => $child_cats,
		);
		wp_send_json($response);
	}
}
