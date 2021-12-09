<?php

function rtcl_rtcl_get_price_unit_list_cb($unit_list) {
    $new_unit_list = [
        'per_hour' => [
            'title' => esc_html__('Per Hour', 'your_text_domain'),
            'short' => esc_html__('per hour', 'your_text_domain')
        ],
        'per_day'  => [
            'title' => esc_html__('Per Day', 'your_text_domain'),
            'short' => esc_html__('per day', 'your_text_domain')
        ]
    ];
    $unit_list = array_merge($unit_list, $new_unit_list);

    return $unit_list;
}

add_filter('rtcl_get_price_unit_list', 'rtcl_rtcl_get_price_unit_list_cb');


function price_for_job_type($html_price, $listing_id) {
    $ad_type = get_post_meta($listing_id, 'ad_type', true);
    if ($ad_type == 'job') {
        $html_price = '';
    } elseif ($ad_type == 'to_let' && is_singular(rtcl()->post_type) && $position = strrpos($html_price, '</span>', -1)) {
        $html_price = substr_replace($html_price, sprintf("<span class='rtcl-per-unit'> / %s</span>", __("Month", "classified-listing")), $position, 0);
    }

    return $html_price;
}

add_filter('rtcl_listing_get_the_price', array(__CLASS__, 'price_for_job_type'), 10, 2);