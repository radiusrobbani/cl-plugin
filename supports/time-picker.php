<?php

function rtcl_store_time_options_rt_cb($data){
	$data['showMeridian'] = false;

	return $data;
}
add_filter('rtcl_store_time_options', 'rtcl_store_time_options_rt_cb');
