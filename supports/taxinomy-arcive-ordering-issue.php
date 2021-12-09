<?php

function rtcl_backup_pre_get_posts($query) {
    // validate
    if (!$query->is_main_query() || is_admin() || !class_exists('Rtcl')) {
        return $query;
    }
    if (\Rtcl\Helpers\Functions::is_listing_taxonomy() && !isset($_GET['orderby'])) {
        $order = \Rtcl\Helpers\Functions::get_option_item('rtcl_general_settings', 'order', 'desc');
        $query->set('order', strtoupper($order));
    }

    // always return
    return $query;

}

add_action('pre_get_posts', 'rtcl_backup_pre_get_posts');