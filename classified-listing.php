<?php
/**
 * @wordpress-plugin
 * Plugin Name:       Classified Listing – Classified ads & Business Directory Plugin
 * Plugin URI:        https://radiustheme.com/demo/wordpress/classified
 * Description:       The Best Classified Listing and Business Directory Plugin for WordPress to create Classified ads website, job directory, local business directory and service directory.
 * Version:           2.0.8
 * Author:            RadiusTheme
 * Author URI:        https://radiustheme.com
 * Text Domain:       classified-listing
 * Domain Path:       /languages
 */

defined('ABSPATH') || die('Keep Silent');

// Define RTCL_PLUGIN_FILE.
define('RTCL_VERSION', '2.0.8');
define('RTCL_PLUGIN_FILE', __FILE__);

if (!class_exists('Rtcl')) {
    require_once 'app/Rtcl.php';
}
