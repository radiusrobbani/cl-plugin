<?php
function custom_pre_get_posts($wp_query) {
    if (($wp_query->is_main_query()) && (is_tax('rtcl_category') || is_tax('rtcl_location'))) {
        $orderby_value = isset($_GET['orderby']) ? Rtcl\Helpers\Functions::clean((string)wp_unslash($_GET['orderby'])) : Rtcl\Helpers\Functions::clean(get_query_var('orderby'));
        $order = 'desc';
        if (!$orderby_value) {
            $order_by = Rtcl\Helpers\Functions::get_option_item('rtcl_general_settings', 'orderby', 'date');
            $order = Rtcl\Helpers\Functions::get_option_item('rtcl_general_settings', 'order', 'desc');
            $orderby_value = apply_filters('rtcl_default_catalog_orderby', $order_by . "-" . $order, $order_by, $order);
        }
        $orderby_value = is_array($orderby_value) ? $orderby_value : explode('-', $orderby_value);
        $orderby = esc_attr($orderby_value[0]);
        $order = !empty($orderby_value[1]) ? $orderby_value[1] : $order;
        $wp_query->set('orderby', $orderby);
        $wp_query->set('order', $order);
    }
}

add_action('pre_get_posts', 'custom_pre_get_posts');