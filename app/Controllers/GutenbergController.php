<?php

/**
 * Main GutenbergController  Class.
 *
 * The main class that initiates and runs the plugin.
 *
 * @package  Classifid-listing
 *
 * @since 1.0.0
 */

namespace Rtcl\Controllers;

use Rtcl\Controllers\Gutenberg\AdminAjaxController;
use Rtcl\Controllers\Gutenberg\ListingsAjaxController;
use Rtcl\Controllers\Gutenberg\RtListingCatReact;
use Rtcl\Controllers\Gutenberg\RtListingSearchReact;
use Rtcl\Controllers\Gutenberg\RtListingsReact;

/**
 * Main GutenbergController  Class.
 *
 * The main class that initiates and runs the plugin.
 *
 * @since 1.0.0
 */
class GutenbergController
{
    /**
     * Undocumented function.
     *
     * @return void
     */
    public function __construct()
    {
        add_filter('init', array($this, 'register_meta'));
        add_action('wp_enqueue_scripts', [ & $this, 'frontend_assets']);
        add_action('admin_enqueue_scripts', [ & $this, 'admin_assets']);
        //add_action('wp_enqueue_scripts', [&$this, 'fonts_loader']);
        //add_action('admin_enqueue_scripts', [&$this, 'fonts_loader']);
        add_action('enqueue_block_editor_assets', [ & $this, 'editor_assets']);
        //add_action('init', [ & $this, 'register_blocks']);
        add_filter('block_categories_all', [ & $this, 'rtcl_gb_block_category']);
        add_action('wp_head', [ & $this, 'block_attribute_css']);

        new AdminAjaxController();
        new ListingsAjaxController();
        new RtListingsReact();
        new RtListingCatReact();
        new RtListingSearchReact();
    }

    public function block_attribute_css()
    {
        $blockStylesheets = '';
        $presentBlocks = array_unique(array_merge($this->getPresentBlocks(), $this->get_widget_block_list(true)), SORT_REGULAR);
        if (empty($presentBlocks)) {
            return;
        }
        foreach ($presentBlocks as $block) {
            $blockStylesheets .= apply_filters('rtcl_gb_attribute_css_' . $block['blockName'], $blockStylesheets, $block);
        }
        $blockStylesheets = preg_replace('/\s+/', ' ', $blockStylesheets);
        if (!$blockStylesheets) {
            return;
        }
        ob_start();?>
		<style><?php echo $blockStylesheets; ?></style>
		<?php ob_end_flush();
    }

    public function frontend_assets()
    {
        $script_dep_path = RTCL_URL . 'dist/frontend.asset.php';
        $script_info = file_exists($script_dep_path)
        ? include $script_dep_path
        : array(
            'dependencies' => array(),
            'version' => RTCL_VERSION,
        );
        $script_dep = array_merge($script_info['dependencies'], array('wp-i18n', 'wp-element', 'wp-api-fetch', 'wp-components'));

        wp_register_script('rtcl-gb-frontend-js', RTCL_URL . '/dist/frontend.js', $script_dep, $script_info['version'], true);

        wp_enqueue_style('rtcl-bootstrap', rtcl()->get_assets_uri('css/rtcl-bootstrap.min.css'), [], '4.1.1');
        wp_enqueue_style('rtcl-public', rtcl()->get_assets_uri('css/rtcl-public.css'), [], RTCL_VERSION);
        //wp_enqueue_script('rtcl-public', rtcl()->get_assets_uri("js/rtcl-public.js"), ['jquery', 'jquery-ui-autocomplete', 'rtcl-common'], RTCL_VERSION, true);
    }

    public function editor_assets()
    {
        wp_enqueue_script('rtcl-gb-blocks-js', RTCL_URL . '/dist/blocks.build.js', ['wp-block-editor', 'wp-blocks', 'wp-components', 'wp-element', 'wp-i18n'], RTCL_VERSION, true);
        wp_localize_script('rtcl-gb-blocks-js', 'rtcl_block_script', [
            'ajaxurl' => admin_url('admin-ajax.php'),
            'rtcl_nonce' => wp_create_nonce('rtcl-nonce'),
        ]);
    }

    public function admin_assets()
    {
        wp_enqueue_style('rtcl-gb-admin-block', rtcl()->get_assets_uri('css/admin-block.css'), [], RTCL_VERSION);
        wp_enqueue_style('rtcl-admin', rtcl()->get_assets_uri('css/rtcl-admin.css'), [], RTCL_VERSION);
        wp_enqueue_style('rtcl-public', rtcl()->get_assets_uri('css/rtcl-public.css'), [], RTCL_VERSION);
        //wp_enqueue_script('rtcl-public', rtcl()->get_assets_uri("js/rtcl-public.js"), ['jquery', 'jquery-ui-autocomplete', 'rtcl-common'], RTCL_VERSION, true);
    }

    public function rtcl_gb_block_category($categories)
    {
        $category_title = __('Classified Listing', 'classified-listing');

        return array_merge(
            $categories,
            [
                [
                    'slug' => 'classified-list-gb',
                    'title' => $category_title,
                ],
            ]
        );
    }

    public function register_blocks()
    {
        if (function_exists('register_block_type')) {
            register_block_type('rt-radius-blocks/posts', [
                'render_callback' => [RtPosts::class, 'render_callback'],
            ]);
            register_block_type('rt-radius-blocks/postsreact', [
                'render_callback' => [RtPostReact::class, 'render_callback'],
            ]);
        }
    }

    public function checkInnerBlocks($block)
    {
        $currentBlocks = [];
        if (strpos($block['blockName'], 'rt-radius-blocks/') !== 0) {
            return $currentBlocks;
        }
        $current = $block;
        if ($block['blockName'] == 'core/block') { //reusable block
            $current = parse_blocks(get_post_field('post_content', $block['attrs']['ref']))[0];
        }
        if ($current['blockName'] != '') {
            array_push($currentBlocks, $current);
            if (count($current['innerBlocks']) > 0) {
                foreach ($current['innerBlocks'] as $innerBlock) {
                    $this->checkInnerBlocks($innerBlock);
                }
            }
        }

        return $currentBlocks;
    }

    public function getPresentBlocks($block_array = null)
    {
        $presentBlocks = [];
        $post_array = get_post();
        if ($post_array || $block_array) {
            foreach (parse_blocks($block_array ?: $post_array->post_content) as $block) {
                $presentBlocks = $this->checkInnerBlocks($block);
            }
        }
        return $presentBlocks;
    }

    public function get_widget_block_list()
    {
        $blockList = [];
        $widget_elements = get_option('widget_block');
        foreach ((array) $widget_elements as $widget_element) {
            if (!empty($widget_element['content'])) {
                $widget_blocks = $this->getPresentBlocks($widget_element['content']);
                foreach ($widget_blocks as $block) {
                    $blockList[] = $block;
                }
            }
        }
        return $blockList;
    }

    public function register_meta()
    {
        register_meta(
            'post',
            '_rtcl_gb_attr',
            array(
                'show_in_rest' => true,
                'single' => true,
                'auth_callback' => [$this, 'auth_callback'],
            )
        );
    }

    public function auth_callback()
    {
        return current_user_can('edit_posts');
    }

    public function fonts_loader()
    {
        global $post;
        if ($post && isset($post->ID)) {
            $fonts = get_post_meta($post->ID, '_rtcl_gb_attr', true);

            if (!empty($fonts)) {

                $fonts = array_unique(explode(',', $fonts));

                $system = array(
                    'Arial',
                    'Tahoma',
                    'Verdana',
                    'Helvetica',
                    'Times New Roman',
                    'Trebuchet MS',
                    'Georgia',
                );

                $gfonts = '';

                $gfonts_attr = ':100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic';

                foreach ($fonts as $font) {
                    if (!in_array($font, $system, true) && !empty($font)) {
                        $gfonts .= str_replace(' ', '+', trim($font)) . $gfonts_attr . '|';
                    }
                }

                if (!empty($gfonts)) {
                    $query_args = array(
                        'family' => $gfonts,
                    );

                    wp_register_style(
                        'rtcl-gb-block-fonts',
                        add_query_arg($query_args, '//fonts.googleapis.com/css'),
                        array()
                    );

                    wp_enqueue_style('rtcl-gb-block-fonts');
                }

                // Reset.
                $gfonts = '';
            }
        }
    }
}
