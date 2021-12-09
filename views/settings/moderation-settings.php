<?php

use Rtcl\Helpers\Functions;
use Rtcl\Resources\Options;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Settings for Payment
 */
$options = array(
    'gs_section'                     => array(
        'title'       => esc_html__('General settings', 'classified-listing'),
        'type'        => 'title',
        'description' => '',
    ),
    'listing_duration'               => array(
        'title'       => esc_html__('Listing duration (in days)', 'classified-listing'),
        'type'        => 'number',
        'default'     => 15,
        'description' => esc_html__('Use a value of "0" to keep a listing alive indefinitely.', 'classified-listing'),
    ),
    'new_listing_threshold'          => array(
        'title'       => esc_html__('New listing threshold (in days)', 'classified-listing'),
        'type'        => 'number',
        'default'     => 3,
        'description' => esc_html__('Enter the number of days the listing will be tagged as "New" from the day it is published.',
            'classified-listing')
    ),
    'new_listing_label'              => array(
        'title'       => esc_html__('Label text for new listings', 'classified-listing'),
        'type'        => 'text',
        'default'     => esc_html__("New", 'classified-listing'),
        'description' => esc_html__('Enter the text you want to use inside the "New" tag.', 'classified-listing')
    ),
    'listing_featured_label'         => array(
        'title'       => esc_html__('Label text for Feature listings', 'classified-listing'),
        'type'        => 'text',
        'default'     => esc_html__("Featured", 'classified-listing'),
        'description' => esc_html__('Enter the text you want to use inside the "Featured" tag.', 'classified-listing')
    ),
    'display_options'                => array(
        'title'   => esc_html__('Show in listing', 'classified-listing'),
        'type'    => 'multi_checkbox',
        'default' => ['category', 'location', 'date', 'excerpt', 'price', 'user', 'views'],
        'options' => Options::get_listing_display_options()
    ),
    'display_options_detail'         => array(
        'title'   => esc_html__('Show in listing detail page', 'classified-listing'),
        'type'    => 'multi_checkbox',
        'default' => array('category', 'location', 'date', 'price', 'user', 'views'),
        'options' => Options::get_listing_detail_page_display_options()
    ),
    'detail_page_sidebar_position'   => array(
        'title'   => esc_html__('Detail page sidebar position', 'classified-listing'),
        'type'    => 'select',
        'class'   => 'rtcl-select2',
        'default' => 'right',
        'options' => Options::detail_page_sidebar_position()
    ),
    'has_favourites'                 => array(
        'title'   => esc_html__('Add to favourites', 'classified-listing'),
        'type'    => 'checkbox',
        'default' => 'yes',
        'label'   => esc_html__('Check this to enable Favourite', 'classified-listing')
    ),
    'has_report_abuse'               => array(
        'title'   => esc_html__('Report abuse', 'classified-listing'),
        'type'    => 'checkbox',
        'default' => 'yes',
        'label'   => esc_html__('Check this to enable Report abuse', 'classified-listing')
    ),
    'has_contact_form'               => array(
        'title'   => esc_html__('Contact form', 'classified-listing'),
        'type'    => 'checkbox',
        'default' => 'yes',
        'label'   => esc_html__('Allows visitors to contact listing authors privately. Authors will receive the messages via email.', 'classified-listing')
    ),
    'has_comment_form'               => array(
        'title' => esc_html__('Review form', 'classified-listing'),
        'type'  => 'checkbox',
        'label' => esc_html__('Allow visitors to review your listing.', 'classified-listing')
    ),
    'maximum_images_per_listing'     => array(
        'title'   => esc_html__('Maximum images allowed per listing', 'classified-listing'),
        'type'    => 'number',
        'default' => 5
    ),
    'delete_expired_listings'        => array(
        'title'       => esc_html__('Delete expired Listings (in days)', 'classified-listing'),
        'type'        => 'number',
        'default'     => 15,
        'description' => esc_html__('If you have the renewal option enabled, this will be the number of days after the "Renewal Reminder" email was sent.',
            'classified-listing')
    ),
    'new_listing_status'             => array(
        'title'       => esc_html__('New Listing status', 'classified-listing'),
        'type'        => 'select',
        'default'     => 'pending',
        'options'     => Options::get_status_list(),
        'description' => esc_html__('Listing status at new listing', 'classified-listing')
    ),
    'edited_listing_status'          => array(
        'title'   => esc_html__('Listing status after edit', 'classified-listing'),
        'type'    => 'select',
        'default' => 'pending',
        'options' => Options::get_status_list()
    ),
    'form_section'                   => array(
        'title'       => esc_html__('Listing Form', 'classified-listing'),
        'type'        => 'title',
        'description' => '',
    ),
    'title_max_limit'                => array(
        'title'       => esc_html__('Title character limit', 'classified-listing'),
        'type'        => 'number',
        'description' => esc_html__('Leave it blank if you like no limit', 'classified-listing')
    ),
    'description_max_limit'          => array(
        'title'       => esc_html__('Description character limit', 'classified-listing'),
        'type'        => 'number',
        'description' => esc_html__('Leave it blank if you like no limit', 'classified-listing')
    ),
    'hide_form_fields'               => [
        'title'   => esc_html__('Hide form fields', 'classified-listing'),
        'type'    => 'multi_checkbox',
        'options' => Options::get_listing_form_hide_fields()
    ],
    'redirect_new_listing'           => array(
        'title'       => esc_html__('Redirect after new listing', 'classified-listing'),
        'type'        => 'select',
        'default'     => 'submission',
        'options'     => Options::get_redirect_page_list(),
        'description' => esc_html__('Redirect after successfully post a new listing', 'classified-listing')
    ),
    'redirect_new_listing_custom'    => array(
        'title'      => esc_html__('Custom redirect url after new listing', 'classified-listing'),
        'type'       => 'url',
        'dependency' => array(
            'rules' => array(
                '#rtcl_moderation_settings-redirect_new_listing' => array(
                    'type'  => 'equal',
                    'value' => 'custom'
                )
            )
        )
    ),
    'redirect_update_listing'        => array(
        'title'       => esc_html__('Redirect after update listing', 'classified-listing'),
        'type'        => 'select',
        'class'       => 'rtcl-select2',
        'default'     => 'account',
        'options'     => Options::get_redirect_page_list(),
        'description' => esc_html__('Redirect after successfully post a new listing', 'classified-listing')
    ),
    'redirect_update_listing_custom' => array(
        'title'      => esc_html__('Custom redirect url after update listing', 'classified-listing'),
        'type'       => 'url',
        'dependency' => array(
            'rules' => array(
                '#rtcl_moderation_settings-redirect_update_listing' => array(
                    'type'  => 'equal',
                    'value' => 'custom'
                )
            )
        )
    )
);

return apply_filters('rtcl_moderation_settings_options', $options);
