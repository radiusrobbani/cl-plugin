<?php

/**
 * Main Gutenberg RtListingsReact Class.
 *
 * The main class that initiates and runs the plugin.
 *
 * @package  Classifid-listing
 *
 * @since 1.0.0
 */

namespace Rtcl\Controllers\Gutenberg;

class RtListingsReact
{
    protected $name = 'rt-radius-blocks/listings';

    protected $attributes = [
        "block_id" => array(
            "type" => "string",
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
        "promotion_in" => array(
            "type" => "array",
        ),
        "promotion_not_in" => array(
            "type" => "array",
        ),
        "orderby" => array(
            "type" => "string",
            "default" => "date",
        ),
        "sortby" => array(
            "type" => "string",
            "default" => "desc",
        ),
        "perPage" => array(
            "type" => "number",
            "default" => 6,
        ),
        "offset" => array(
            "type" => "number",
            "default" => 0,
        ),
        "align" => array(
            "type" => "string",
        ),

        "col_padding" => array(
            "type" => "object",
            "default" => array(
                "unit" => "px",
            ),
        ),

        "content_padding" => array(
            "type" => "object",
            "default" => array(
                "unit" => "px",
            ),
        ),

        "col_style" => array(
            "type" => "object",
            "default" => array(
                "style" => "list",
                "style_list" => "1",
                "style_grid" => "1",
                "gsUnit" => "px",
                "gutterSpace" => 30,
                "bg-style" => "normal",
                "bg-color" => "",
                "hv-bg-color" => "",
                "border-color" => "",
                "border-width" => "",
                "border-style" => "solid",
                "border-radius" => "",
            ),
        ),

        "promotion_style" => array(
            "type" => "object",
            "default" => array(
                'newBGColor' => '',
                'newColor' => '',
                'featuredBGColor' => '',
                'featuredBDColor' => '',
                'topBGColor' => '',
                'topBDColor' => '',
                'popularBGColor' => '',
                'popularBDColor' => '',
                'bumpBGColor' => '',
                'bumpBDColor' => '',
            ),
        ),

        "title_style" => array(
            "type" => "object",
            "default" => array(
                "colorStyle" => "normal",
                "color" => "",
                "hvColor" => "",
                "fsUnit" => "px",
                "fontSize" => "",
                "textTransform" => "",
                "letterSpacing" => "",
                'lsUnit' => "px",
                "lineHeight" => "",
                "lhUnit" => "px",
                'fontWeight' => "bold",
                'newBGColor' => '',
                'newColor' => '',
                'featuredBGColor' => '',
                'featuredColor' => '',
                'topBGColor' => '',
                'topColor' => '',
                'popularBGColor' => '',
                'popularColor' => '',
                'bumpBGColor' => '',
                'bumpColor' => '',
            ),
        ),

        "badge_style" => array(
            "type" => "object",
            "default" => array(
                "fsUnit" => "px",
                "fontSize" => "",
                "textTransform" => "",
                "letterSpacing" => "",
                'lsUnit' => "px",
                "lineHeight" => "",
                "lhUnit" => "px",
                'fontWeight' => "",
                'newBGColor' => '',
                'newColor' => '',
                'featuredBGColor' => '',
                'featuredColor' => '',
                'topBGColor' => '',
                'topColor' => '',
                'popularBGColor' => '',
                'popularColor' => '',
                'bumpBGColor' => '',
                'bumpColor' => '',
            ),
        ),

        "sold_style" => array(
            "type" => "object",
            "default" => array(
                "fsUnit" => "px",
                "fontSize" => "",
                "textTransform" => "",
                "letterSpacing" => "",
                'lsUnit' => "px",
                "lineHeight" => "",
                "lhUnit" => "px",
                'fontWeight' => "bold",
                'soldBGColor' => '',
                'soldColor' => '',
            ),
        ),

        "meta_style" => array(
            "type" => "object",
            "default" => array(
                "color" => "",
                "iconColor" => "",
                "fsUnit" => "px",
                "fontSize" => "",
                "textTransform" => "",
                "letterSpacing" => "",
                'lsUnit' => "px",
                "lineHeight" => "",
                "lhUnit" => "px",
                'fontWeight' => "normal",
            ),
        ),

        "price_style" => array(
            "type" => "object",
            "default" => array(
                "bgColor" => "",
                "color" => "",
                "fontSize" => "",
                "fsUnit" => "px",
                "fontWeight" => "",
                "unitLabelColor" => "",
                "unitLFSize" => "",
                "unitLFSizeUnit" => "px",
                "unitLFSizeWeight" => "",

            ),
        ),

        "price_padding" => array(
            "type" => "object",
            "default" => array(
                "unit" => "px",
            ),
        ),

        "price_margin" => array(
            "type" => "object",
            "default" => array(
                "unit" => "px",
            ),
        ),

        "button_style" => array(
            "type" => "object",
            "default" => array(
                "bgColor" => "",
                "hvBGColor" => "",
                "color" => "",
                "hvColor" => "",
            ),
        ),

        "content_style" => array(
            "type" => "object",
            "default" => array(
                "color" => "",
                "fsUnit" => "px",
                "fontSize" => "",
                "textTransform" => "",
                "letterSpacing" => "",
                'lsUnit' => "px",
                "lineHeight" => "",
                "lhUnit" => "px",
                'fontWeight' => "normal",
            ),
        ),

        "content_margin" => array(
            "type" => "object",
            "default" => array(
                "unit" => "px",
            ),
        ),

        "container_padding" => array(
            "type" => "object",
            "default" => array(
                "unit" => "px",
            ),
        ),
        "container_margin" => array(
            "type" => "object",
            "default" => array(
                "unit" => "px",
            ),
        ),

        "container_style" => array(
            "type" => "object",
            "default" => array(
                "bgColor" => "",
            ),
        ),
        "content_visibility" => array(
            "type" => "object",
            "default" => array(
                "badge" => true,
                "location" => true,
                "category" => true,
                "date" => true,
                "price" => true,
                "author" => true,
                "view" => true,
                "content" => true,
                "grid_content" => false,
                "title" => true,
                "thumbnail" => true,
                "listing_type" => true,
                "thumb_position" => "",
                "details_btn" => true,
                "favourit_btn" => true,
                "phone_btn" => true,
                "compare_btn" => true,
                "quick_btn" => true,
                "sold" => true,
                "pagination" => true,

            ),
        ),
        "content_limit" => array(
            "type" => "number",
            "default" => 60,
        ),
        "col_desktop" => array(
            "type" => "string",
            "default" => "4",
        ),
        "col_tablet" => array(
            "type" => "string",
            "default" => "2",
        ),
        "col_mobile" => array(
            "type" => "string",
            "default" => "1",
        ),

    ];

    public function __construct()
    {
        add_action('init', [$this, 'register_listings']);
    }

    public function register_listings()
    {
        if (!function_exists('register_block_type')) {
            return;
        }
        register_block_type(
            'rt-radius-blocks/listings',
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

		<div class="rt-radius-blocks-ph rt-listings-react">
			<pre style="display: none;"><?php echo wp_json_encode($attributes) ?></pre>
		</div>
		<?php return ob_get_clean();
    }
}
