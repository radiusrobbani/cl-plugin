<?php

add_action('init', function (){
    remove_action('wp_head', [\Rtcl\Controllers\PageController::class, 'page_noindex']);
});