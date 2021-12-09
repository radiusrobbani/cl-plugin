<?php

/**
 * Main Gutenberg RtListingCatReact Class
 *
 * The main class that initiates and runs the plugin.
 *
 * @package  Classifid-listing
 * @since 1.0.0
 */

namespace Rtcl\Controllers\Gutenberg;

class RtListingCatReact
{
    protected $name = 'rt-radius-blocks/listing-catreact';

    protected $attributes = [
        "client_id" => array(
            "type" => "string",
        ),

        "cats" => array(
            "type" => "array",
        ),
        "orderby" => array(
            "type" => "string",
            "default" => "count",
        ),
        "sortby" => array(
            "type" => "string",
            "default" => "desc",
        ),
        "hide_empty" => array(
            "type" => "boolean",
            "default" => false,
        ),

        "align" => array(
            "type" => "string",
            "default" => "center",
        ),
        "content_limit" => array(
            "type" => "number",
            "default" => 10,
        ),
        "category_limit" => array(
            "type" => "number",
            "default" => 12,
        ),
        "sub_category_limit" => array(
            "type" => "number",
            "default" => 5,
        ),
        "icon_type" => array(
            "type" => "string",
            "default" => "icon",
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

        "col_padding" => array(
            "type" => "object",
            "default" => array(
                "unit" => "px",
            ),
        ),

        "col_style" => array(
            "type" => "object",
            "default" => array(
                "style" => "1",
                "gsUnit" => "px",
                "gutterSpace" => 30,
                "bgStyle" => "normal",
                "bgColor" => "",
                "hvBGColor" => "",
                "borderColor" => "",
                "borderWidth" => "",
                "borderStyle" => "solid",
                "borderRadius" => "",
                "col",
            ),
        ),

        "content_visibility" => array(
            "type" => "object",
            "default" => array(
                "icon" => true,
                "subCat" => true,
                "catDesc" => false,
                "counter" => true,
            ),
        ),

        "icon_style" => array(
            "type" => "object",
            "default" => array(
                "colorStyle" => "normal",
                "color" => "",
                "hvColor" => "",
                "fsUnit" => "px",
                "fontSize" => "",
                "lineHeight" => "",
                "lhUnit" => "px",
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
            ),
        ),
        "counter_style" => array(
            "type" => "object",
            "default" => array(
                "colorStyle" => "normal",
                "color" => "",
                "hvColor" => "",
                "fsUnit" => "px",
                "fontSize" => "",
            ),
        ),
        "content_style" => array(
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
                'fontWeight' => "",
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

        "sub_cat_style" => array(
            "type" => "object",
            "default" => array(
                "colorStyle" => "normal",
                "color" => "",
                "hvColor" => "",
                "bgColor" => "",
                "iconColor" => "",
                "hvIconColor" => "",
                "fsUnit" => "px",
                "fontSize" => "",
            ),
        ),

        "sub_cat_padding" => array(
            "type" => "object",
            "default" => array(
                "unit" => "px",
            ),
        ),
    ];

    public function __construct()
    {
        add_action('init', array($this, 'register_listing_cat_box'));
    }

    public function register_listing_cat_box()
    {
        if (!function_exists('register_block_type')) {
            return;
        }
        register_block_type(
            'rt-radius-blocks/listing-catreact',
            array(
                'render_callback' => array($this, 'render_callback_listing_cat_box'),
                'attributes' => $this->attributes,
            )
        );
    }

    public function render_callback_listing_cat_box($attributes)
    {

        wp_enqueue_script('rtcl-gb-frontend-js');
        wp_localize_script('rtcl-gb-frontend-js', 'rtcl_block_script', [
            'ajaxurl' => admin_url('admin-ajax.php'),
            'rtcl_nonce' => wp_create_nonce('rtcl-nonce'),
        ]);

        ob_start();?>
        <div class="rt-radius-blocks-ph rt-listing-catreact <?php echo esc_attr('align' . $attributes['align']); ?>">
            <pre style="display: none;"><?php echo wp_json_encode($attributes) ?></pre>
        </div>
		<?php return ob_get_clean();
    }
}
