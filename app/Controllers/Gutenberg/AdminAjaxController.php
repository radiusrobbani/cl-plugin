<?php

namespace Rtcl\Controllers\Gutenberg;

use Rtcl\Helpers\Functions;
use Rtcl\Resources\Options;

class AdminAjaxController
{
    public function __construct()
    {
        //get categories for inspector controller
        add_action('wp_ajax_rtcl_gb_categories', [$this, 'rtcl_gb_categories']);
        add_action('wp_ajax_nopriv_rtcl_gb_categories', [$this, 'rtcl_gb_categories']);
        //get locations for inspector controller
        add_action('wp_ajax_rtcl_gb_location_ajax', [$this, 'rtcl_gb_location_ajax']);
        add_action('wp_ajax_nopriv_rtcl_gb_location_ajax', [$this, 'rtcl_gb_location_ajax']);
        //get listing type for inspector controller
        add_action('wp_ajax_rtcl_gb_listing_type_ajax', [$this, 'rtcl_gb_listing_type_ajax']);
        add_action('wp_ajax_nopriv_rtcl_gb_listing_type_ajax', [$this, 'rtcl_gb_listing_type_ajax']);
        //get promotion for inspector controller
        add_action('wp_ajax_rtcl_gb_listing_promotion_ajax', [$this, 'rtcl_gb_listing_promotion_ajax']);
        add_action('wp_ajax_nopriv_rtcl_gb_listing_promotion_ajax', [$this, 'rtcl_gb_listing_promotion_ajax']);
        //get categories for category box block
        add_action('wp_ajax_nopriv_rtcl_gb_listing_cat_box', [$this, 'rtcl_gb_listing_cat_box']);
        add_action('wp_ajax_rtcl_gb_listing_cat_box', [$this, 'rtcl_gb_listing_cat_box']);
    }

    public function rtcl_gb_listing_promotion_ajax()
    {
        $rtcl_nonce = $_POST['rtcl_nonce'];
        if (!wp_verify_nonce($rtcl_nonce, 'rtcl-nonce')) {
            wp_send_json_error(esc_html__('Session Expired!!', 'classified-listing'));
        }
        $promotions = Options::get_listing_promotions();
        if (!empty($promotions)):
            wp_send_json($promotions);
        else: ?>
			<p><div class="ajax-data-notfound"><?php echo __('Content empty'); ?></div></p>
		<?php endif;
        wp_die();
    }

    public function rtcl_gb_listing_type_ajax()
    {
        $rtcl_nonce = $_POST['rtcl_nonce'];
        if (!wp_verify_nonce($rtcl_nonce, 'rtcl-nonce')) {
            wp_send_json_error(esc_html__('Session Expired!!', 'classified-listing'));
        }

        $listing_types_arr = ["all" => "All"];
        $listing_types = Functions::get_listing_types();

        foreach ($listing_types as $id => $name) {
            $listing_types_arr[$id] = $name;
        }

        if (!empty($listing_types_arr)):
            wp_send_json($listing_types_arr);
        else: ?>
			<p><div class="ajax-data-notfound"><?php echo __('Content empty'); ?></div></p>
		<?php endif;
        wp_die();
    }

    public function rtcl_gb_location_ajax()
    {

        $rtcl_nonce = $_POST['rtcl_nonce'];
        if (!wp_verify_nonce($rtcl_nonce, 'rtcl-nonce')) {
            wp_send_json_error(esc_html__('Session Expired!!', 'classified-listing'));
        }

        $args = [
            'taxonomy' => 'rtcl_location',
            'fields' => 'id=>name',
            'height_empty' => true,
        ];

        $location_dropdown = [];
        $terms = get_terms($args);

        foreach ($terms as $id => $name) {
            $location_dropdown[$id] = $name;
        }

        if (!empty($location_dropdown)):
            wp_send_json($location_dropdown);
        else: ?>
			<p><div class="ajax-data-notfound"><?php echo __('Content empty'); ?></div></p>
		<?php endif;

        wp_reset_postdata();
        wp_die();

    }

    public static function rtcl_cat_box_query($data)
    {
        $results = [];

        if (!empty($data['cats'])):
            $data['cats'] = wp_list_pluck($data['cats'], 'value');
        endif;

        $args = [
            'parent' => 0,
            'include' => isset($data['cats']) ? $data['cats'] : [],
            'hide_empty' => $data['hide_empty'] == 'true' ? true : false,
            'order' => 'asc',
            'hierarchical' => false,
        ];

        if ($data['orderby'] == 'custom') {
            $args['orderby'] = 'meta_value_num';
            $args['order'] = $data['sortby'] ? $data['sortby'] : 'asc';
            $args['meta_key'] = '_rtcl_order';
        } else {
            $args['orderby'] = $data['orderby'] ? $data['orderby'] : 'date';
            $args['order'] = $data['sortby'] ? $data['sortby'] : 'asc';
        }

        $terms = get_terms('rtcl_category', $args);

        if (!empty($data['category_limit'])) {
            $number = $data['category_limit'];
            $terms = array_slice($terms, 0, $number);
        }

        if (!empty($terms)):
            foreach ($terms as $term) {
                $order = get_term_meta($term->term_id, '_rtcl_order', true);
                $icon_html = '';
                if ($data['icon_type'] == 'icon') {
                    $icon = get_term_meta($term->term_id, '_rtcl_icon', true);
                    if ($icon) {
                        $icon_html = sprintf('<span class="rtcl-icon rtcl-icon-%s"></span>', $icon);
                    }
                } elseif ($data['icon_type'] == 'image') {
                $image = get_term_meta($term->term_id, '_rtcl_image', true);
                if ($image) {
                    $image = wp_get_attachment_image_src($image);
                    $width = $image[1];
                    $height = $image[2];
                    $image = $image[0];
                    $icon_html = sprintf('<img src="%s" alt="%s" width="%s" height="%s" />', $image, $term->name, $width, $height);
                } else {
                    $icon = get_term_meta($term->term_id, '_rtcl_icon', true);
                    if ($icon) {
                        $icon_html = sprintf('<span class="rtcl-icon rtcl-icon-%s"></span>', $icon);
                    }
                }
            }
            $count = self::rt_term_post_count($term->term_id);

            //category children list
            $child_html = '';
            $child_args = array(
                'taxonomy' => 'rtcl_category',
                'parent' => $term->term_id,
                'number' => $data['sub_category_limit'],
                'hide_empty' => false,
                'orderby' => 'count',
                'order' => 'DESC',
            );
            $child_terms = get_terms($child_args);
            if (!empty($child_terms) && !is_wp_error($child_terms)) {
                foreach ($child_terms as $child_trm) {
                    $child_html .= sprintf('<li><i class="rtcl-icon rtcl-icon-angle-right"></i><a href="%s">%s (%s)</a></li>',
                        get_term_link($child_trm),
                        $child_trm->name,
                        $child_trm->count
                    );
                }
            }

            $results[] = [
                'name' => $term->name,
                'description' => $term->description,
                'order' => (int) $order,
                'permalink' => get_term_link($term),
                'count' => $count,
                'icon_html' => $icon_html,
                'child_html' => $child_html,
            ];

            $child_html = '';

            if ('count' == $args['orderby']) {
                if ('desc' == $args['order']) {
                    usort($results, function ($a, $b) {
                        return $b['count'] - $a['count'];
                    });
                }
                if ('asc' == $args['order']) {
                    usort($results, function ($a, $b) {
                        return $a['count'] - $b['count'];
                    });
                }
            }
        }
        endif;

        return $results;
    }

    private static function rt_term_post_count($term_id)
    {
        $args = [
            'nopaging' => true,
            'fields' => 'ids',
            'post_type' => 'rtcl_listing',
            'post_status' => 'publish',
            'ignore_sticky_posts' => 1,
            'suppress_filters' => false,
            'tax_query' => [
                [
                    'taxonomy' => 'rtcl_category',
                    'field' => 'term_id',
                    'terms' => $term_id,
                ],
            ],
        ];
        $posts = get_posts($args);

        return count($posts);
    }

    public function rtcl_gb_listing_cat_box()
    {
        if (!wp_verify_nonce($_POST['rtcl_nonce'], 'rtcl-nonce')) {
            wp_send_json_error(esc_html__('Session Expired!!', 'classified-listing'));
        }
        $data = $_POST['attributes'];
        $results = self::rtcl_cat_box_query($data);

        if (!empty($results)) {
            wp_send_json_success($results);
        } else {
            wp_send_json_error("no post found");
        }
    }

    public function rtcl_gb_categories()
    {
        $rtcl_nonce = $_POST['rtcl_nonce'];
        if (!wp_verify_nonce($rtcl_nonce, 'rtcl-nonce')) {
            wp_send_json_error(esc_html__('Session Expired!!', 'classified-listing'));
        }

        $args = [
            'taxonomy' => 'rtcl_category',
            'fields' => 'id=>name',
        ];

        if ($_POST['portion'] === 'listing'):
            $category_dropdown = [];
            $args['hide_empty'] = true;
        elseif ($_POST['portion'] === 'catbox'):
            $category_dropdown = [];
            $args['hide_empty'] = false;
            $args['parent'] = 0;
        else:
            $category_dropdown = [];
        endif;

        $terms = get_terms($args);

        foreach ($terms as $id => $name) {
            $category_dropdown[$id] = html_entity_decode($name);
        }

        if (!empty($category_dropdown)):
            wp_send_json($category_dropdown);
        else: ?>
			<p><div class="ajax-data-notfound"><?php echo __('Content empty'); ?></div></p>
		<?php endif;

        wp_reset_postdata();
        wp_die();
    }

}
