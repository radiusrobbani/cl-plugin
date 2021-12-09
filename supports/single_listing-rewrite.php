<?php

/**
 * @param $post_link
 * @param $post
 *
 * @return string|string[]
 */
function rtcl_replace_permalink_params_cb( $post_link, $post ) {
	if ( is_object( $post ) && $post->post_type == rtcl()->post_type ) {
		$cat_terms     = wp_get_object_terms( $post->ID, rtcl()->category );
		$loc_terms     = wp_get_object_terms( $post->ID, rtcl()->location );
		$category_slug = 'rtcl_category';
		$location_slug = 'rtcl_location';
		if ( ! empty( $cat_terms ) ) {
			$category      = end( $cat_terms );
			$category_slug = $category->slug;
		}
		$post_link = str_replace( '%rtcl_category%', $category_slug, $post_link );
		if ( ! empty( $loc_terms ) ) {
			$location      = end( $loc_terms );
			$location_slug = $location->slug;
		}
		$post_link = str_replace( '%rtcl_location%', $location_slug, $post_link );


		return str_replace( '%post_id%', $post->ID, $post_link );
	}

	return $post_link;
}

add_filter( 'post_type_link', 'rtcl_replace_permalink_params_cb', 1, 4 );

function rtcl_listing_register_post_type_rules( $post_type, $args ) {

	if ( $args->_builtin ) {
		return;
	}

	if ( false === $args->rewrite ) {
		return;
	}

	if ( rtcl()->post_type !== $post_type ) {
		return;
	}
	$rewrite_args              = $args->rewrite;
	$permalink                 = '%rtcl_category%/%rtcl_location%/%' . $post_type . '%-%post_id%';
	$rewrite_args['walk_dirs'] = false;
	add_permastruct( $post_type, $permalink, $rewrite_args );

}

add_action( 'registered_post_type', 'rtcl_listing_register_post_type_rules', 10, 2 );