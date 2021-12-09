<?php

/**
 * Main Gutenberg RtListingSearchReact Class.
 *
 * The main class that initiates and runs the plugin.
 *
 * @package  Classifid-listing
 *
 * @since 1.0.0
 */

namespace Rtcl\Controllers\Gutenberg;

class RtListingSearchReact
{
    protected $name = 'rt-radius-blocks/search-form';

    protected $attributes = [
        "block_id" => array(
            "type" => "string",
        ),
        "style" => array(
            "type" => "string",
            "default" => '1',
        ),
        "cats" => array(
            "type" => "array",
        ),
        "locations" => array(
            "type" => "array",
        ),
        "listing_type" => array(
            "type" => "string",
            "default" => "all",
        ),

    ];

    public function __construct()
    {
        add_action('init', [$this, 'register_listing_serch_form']);
    }

    public function register_listing_serch_form()
    {
        if (!function_exists('register_block_type')) {
            return;
        }
        register_block_type(
            'rt-radius-blocks/search-form',
            [
                'render_callback' => [$this, 'render_callback_listings'],
                'attributes' => $this->attributes,
            ]
        );
    }

    public function render_callback_listings($attributes)
    {

        $attributes = array_merge(array_map(function ($attribute) {
            return isset($attribute['default']) ? $attribute['default'] : null;
        }, $this->attributes), $attributes);

        wp_enqueue_script('rtcl-gb-frontend-js');
        wp_localize_script('rtcl-gb-frontend-js', 'rtcl_block_script', [
            'ajaxurl' => admin_url('admin-ajax.php'),
            'rtcl_nonce' => wp_create_nonce('rtcl-nonce'),
        ]);
        ob_start();?>

		<div class="rt-radius-blocks-ph rt-listing-search-react">
			<pre style="display: none;"><?php echo wp_json_encode($attributes) ?></pre>
		</div>
		<?php return ob_get_clean();
    }
}
