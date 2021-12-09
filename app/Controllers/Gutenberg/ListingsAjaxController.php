<?php

namespace Rtcl\Controllers\Gutenberg;

use RtclPro\Helpers\Fns;
use Rtcl\Helpers\Functions;
use Rtcl\Models\Listing;
use Rtcl\Resources\Options;
use WP_Query;

class ListingsAjaxController
{
    public function __construct()
    {
        add_action('wp_ajax_rtcl_gb_listings_ajax', [$this, 'rtcl_gb_listings_ajax']);
        add_action('wp_ajax_nopriv_rtcl_gb_listings_ajax', [$this, 'rtcl_gb_listings_ajax']);
    }

    public static function rtcl_gb_listings_query($data, $offset)
    {

        $results = [];

        $data['cats'] = !empty($data['cats']) ? wp_list_pluck($data['cats'], 'value') : [];
        $data['locations'] = !empty($data['locations']) ? wp_list_pluck($data['locations'], 'value') : [];
        $data['promotion_in'] = !empty($data['promotion_in']) ? wp_list_pluck($data['promotion_in'], 'value') : [];
        $data['promotion_not_in'] = !empty($data['promotion_not_in']) ? wp_list_pluck($data['promotion_not_in'], 'value') : [];
        $listing_type = !empty($data['listing_type']) ? $data['listing_type'] : 'all';
        $orderby = !empty($data['orderby']) ? $data['orderby'] : 'date';
        $order = !empty($data['sortby']) ? $data['sortby'] : 'desc';

        $args = [
            'post_type' => 'rtcl_listing',
            'post_status' => 'publish',
            'posts_per_page' => $data['perPage'],
            'offset' => $offset,
            'tax_query' => array(
                'relation' => 'AND',
            ),
        ];

        if (!empty($order) && !empty($orderby)) {
            switch ($orderby) {
                case 'price':
                    $args['meta_key'] = $orderby;
                    $args['orderby'] = 'meta_value_num';
                    $args['order'] = $order;
                    break;
                case 'views':
                    $args['meta_key'] = '_views';
                    $args['orderby'] = 'meta_value_num';
                    $args['order'] = $order;
                    break;
                case 'rand':
                    $args['orderby'] = $orderby;
                    break;
                default:
                    $args['orderby'] = $orderby;
                    $args['order'] = $order;
            }
        }

        // Taxonomy
        if (!empty($data['cats'])) {
            $args['tax_query'][] = [
                'taxonomy' => 'rtcl_category',
                'field' => 'term_id',
                'terms' => $data['cats'],
            ];
        }
        if (!empty($data['locations'])) {
            $args['tax_query'][] = [
                'taxonomy' => 'rtcl_location',
                'field' => 'term_id',
                'terms' => $data['locations'],
            ];
        }

        $promotion_common = array_intersect($data['promotion_in'], $data['promotion_not_in']);
        $promotion_in = array_diff($data['promotion_in'], $promotion_common, );
        $promotion_not_in = array_merge($promotion_common, array_diff($data['promotion_not_in'], $promotion_common));

        if (!empty($promotion_in) && is_array($promotion_in)) {
            $promotions = array_keys(Options::get_listing_promotions());
            foreach ($promotion_in as $promotion) {
                if (is_string($promotion) && in_array($promotion, $promotions)) {
                    $meta_queries[] = array(
                        'key' => $promotion,
                        'compare' => '=',
                        'value' => 1,
                    );
                }
            }
        }

        if (!empty($promotion_not_in) && is_array($promotion_not_in)) {
            $promotions = array_keys(Options::get_listing_promotions());
            foreach ($promotion_not_in as $promotion) {
                if (is_string($promotion) && in_array($promotion, $promotions)) {
                    $meta_queries[] = array(
                        'relation' => 'OR',
                        array(
                            'key' => $promotion,
                            'compare' => '!=',
                            'value' => 1,
                        ),
                        array(
                            'key' => $promotion,
                            'compare' => 'NOT EXISTS',
                        ),
                    );
                }
            }
        }

        if ($listing_type && in_array($listing_type, array_keys(Functions::get_listing_types())) && !Functions::is_ad_type_disabled()) {
            $meta_queries[] = array(
                'key' => 'ad_type',
                'value' => $listing_type,
                'compare' => '=',
            );
        }

        $count_meta_queries = count($meta_queries);
        if ($count_meta_queries) {
            $args['meta_query'] = ($count_meta_queries > 1) ? array_merge(array('relation' => 'AND'), $meta_queries) : $meta_queries;
        }

        $loop_obj = new \WP_Query($args);

        while ($loop_obj->have_posts()):
            $loop_obj->the_post();
            $_id = get_the_ID();
            $listing = new Listing($_id);
            $liting_class = Functions::get_listing_class(array('rtcl-widget-listing-item', 'listing-item'), $_id);
            $phone = get_post_meta($_id, 'phone', true);
            $compare = $quick_view = $sold_item = '';

            if (rtcl()->has_pro()) {
                if ($listing && Fns::is_enable_mark_as_sold() && Fns::is_mark_as_sold($listing->get_id())) {
                    $sold_item = '<span class="rtcl-sold-out">' . apply_filters('rtcl_sold_out_banner_text', esc_html__("Sold Out", 'classified-listing-pro')) . '</span>';
                }
            }

            if (rtcl()->has_pro()) {
                if (Fns::is_enable_compare()) {
                    $compare_ids = !empty($_SESSION['rtcl_compare_ids']) ? $_SESSION['rtcl_compare_ids'] : array();
                    $selected_class = '';
                    if (is_array($compare_ids) && in_array($_id, $compare_ids)) {
                        $selected_class = ' selected';
                    }
                    $compare = sprintf(
                        '<a class="rtcl-compare %s" href="#" data-listing_id="%s"><i class="rtcl-icon rtcl-icon-retweet"></i><span class="compare-label">%s</span></a>',
                        $selected_class,
                        absint($_id),
                        esc_html__("Compare", "classified-listing")
                    );
                }
            }

            if (rtcl()->has_pro()) {
                if (Fns::is_enable_quick_view()) {
                    $quick_view = sprintf(
                        '<a class="rtcl-quick-view" href="#" data-listing_id="%s"><i class="rtcl-icon rtcl-icon-zoom-in"></i><span class="quick-label">%s</span></a>',
                        absint($_id),
                        esc_html__("Quick View", "classified-listing")
                    );
                }
            }

            $pp_id = absint(get_user_meta($listing->get_owner_id(), '_rtcl_pp_id', true));
            $author_image = $pp_id ? wp_get_attachment_image($pp_id, array(40, 40)) : get_avatar($_id, 40);

            $results[] = [
                "ID" => $_id,
                "title" => get_the_title(),
                "thumbnail" => $listing->get_the_thumbnail(),
                "locations" => $listing->the_locations(false),
                "categories" => $listing->the_categories(false, true),
                "price" => $listing->get_price_html(),
                "excerpt" => get_the_excerpt($_id),
                "time" => $listing->get_the_time(),
                "badges" => $listing->badges(),
                "views" => absint(get_post_meta(get_the_ID(), '_views', true)),
                "author" => get_the_author(),
                "classes" => $liting_class,
                "post_link" => get_post_permalink(),
                "listing_type" => $listing->get_ad_type(),
                "favourite_link" => Functions::get_favourites_link($_id),
                "compare" => $compare,
                "quick_view" => $quick_view,
                "phone" => $phone,
                "author_image" => $author_image,
                "sold" => $sold_item,

            ];

        endwhile;?>
		<?php wp_reset_postdata();?>

        <?php return array(
            "total_post" => $loop_obj->found_posts,
            "posts" => $results,
        );
    }

    public function rtcl_gb_listings_ajax()
    {
        if (!wp_verify_nonce($_POST['rtcl_nonce'], 'rtcl-nonce')) {
            wp_send_json_error(esc_html__('Session Expired!!', 'classified-listing'));
        }

        $data = $_POST['attributes'];
        $offset = $_POST['offset'];

        $listings = self::rtcl_gb_listings_query($data, $offset);

        if (!empty($listings["posts"])) {
            wp_send_json_success($listings);
        } else {
            wp_send_json_error("no post found");
        }
    }
}
