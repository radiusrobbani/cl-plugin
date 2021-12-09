<?php
function rt_rtcl_get_currency_symbols_cb($symbols) {
    $symbols['LKR'] = 'RS';
    return $symbols;
}

add_filter('rtcl_get_currency_symbols', 'rt_rtcl_get_currency_symbols_cb');