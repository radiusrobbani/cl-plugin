<?php

function rtcl_price_types_rt_cb( $price_types ) {

	// If you like to remove default
	//	$price_types = [];
	$price_types['pound']  = __( "Pound" );
	$price_types['ounce']  = __( "Ounce" );
	$price_types['each']   = __( "Each" );
	$price_types['bushel'] = __( "Bushel" );
	$price_types['dozen']  = __( "Dozen" );

	return $price_types;
}

add_filter( 'rtcl_price_types', 'rtcl_price_types_rt_cb' );
