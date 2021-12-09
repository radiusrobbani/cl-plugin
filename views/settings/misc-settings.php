<?php

use Rtcl\Helpers\Functions;
use Rtcl\Resources\Options;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Settings for misc
 */
$options = array(
    'img_gallery_section'          => array(
        'title' => esc_html__('Image Sizes', 'classified-listing'),
        'type'  => 'title',
    ),
    'image_size_gallery'           => array(
        'title'       => esc_html__('Galley Slider', 'classified-listing'),
        'type'        => 'image_size',
        'default'     => array('width' => 800, 'height' => 380, 'crop' => 'yes'),
        'options'     => array(
            'width'  => esc_html__('Width', 'classified-listing'),
            'height' => esc_html__('Height', 'classified-listing'),
            'crop'   => esc_html__('Hard Crop', 'classified-listing'),
        ),
        'description' => esc_html__('This image size is being used in the image slider on Listing details pages.', "classified-listing")
    ),
    'image_size_gallery_thumbnail' => array(
        'title'       => esc_html__('Gallery Thumbnail', 'classified-listing'),
        'type'        => 'image_size',
        'default'     => array('width' => 150, 'height' => 105, 'crop' => 'yes'),
        'options'     => array(
            'width'  => esc_html__('Width', 'classified-listing'),
            'height' => esc_html__('Height', 'classified-listing'),
            'crop'   => esc_html__('Hard Crop', 'classified-listing'),
        ),
        'description' => esc_html__('Gallery thumbnail image size', "classified-listing")
    ),
    'image_size_thumbnail'         => array(
        'title'       => esc_html__('Thumbnail', 'classified-listing'),
        'type'        => 'image_size',
        'default'     => array('width' => 300, 'height' => 240, 'crop' => 'yes'),
        'options'     => array(
            'width'  => esc_html__('Width', 'classified-listing'),
            'height' => esc_html__('Height', 'classified-listing'),
            'crop'   => esc_html__('Hard Crop', 'classified-listing'),
        ),
        'description' => esc_html__('Listing thumbnail size will use all listing page', "classified-listing")
    ),
    'image_allowed_type'           => array(
        'title'   => esc_html__('Allowed Image type', 'classified-listing'),
        'type'    => 'multi_checkbox',
        'default' => array('png', 'jpeg', 'jpg'),
        'options' => array(
            'png'  => esc_html__('PNG', 'classified-listing'),
            'jpg'  => esc_html__('JPG', 'classified-listing'),
            'jpeg' => esc_html__('JPEG', 'classified-listing'),
        )
    ),
    'image_allowed_memory'         => array(
        'title'       => esc_html__('Allowed Image memory size', 'classified-listing'),
        'type'        => 'number',
        'default'     => 2,
        'description' => sprintf(__('Enter the image memory size, like 2 for 2 MB (only number with out MB) <br><span style="color: red">Your hosting allowed maximum %s</span>',
            'classified-listing'), Functions::formatBytes(Functions::get_wp_max_upload()))
    ),
    'image_edit_cap'               => array(
        'title'   => esc_html__('User can edit image', 'classified-listing'),
        'type'    => 'checkbox',
        'default' => 'yes',
        'label'   => esc_html__('User can edit image size , can crop , can make feature', 'classified-listing')
    ),
    'placeholder_image'            => array(
        'title' => esc_html__('Place holder image', 'classified-listing'),
        'type'  => 'image',
        'label' => esc_html__('Select an Image to display as placeholder if have no image.', 'classified-listing')
    ),
    'single_listing_section'       => [
        'title' => esc_html__('Single Listing', 'classified-listing'),
        'type'  => 'title',
    ],
    'disable_gallery_slider'       => [
        'title' => esc_html__('Disable gallery slider', 'classified-listing'),
        'type'  => 'checkbox',
        'label' => esc_html__('Disable', 'classified-listing'),
    ],
    'disable_gallery_video'        => [
        'title' => esc_html__('Disable gallery video', 'classified-listing'),
        'type'  => 'checkbox',
        'label' => esc_html__('Disable', 'classified-listing'),
    ],
    'social_section'               => array(
        'title' => esc_html__('Social Share buttons', 'classified-listing'),
        'type'  => 'title',
    ),
    'social_services'              => array(
        'title'   => esc_html__('Enable services', 'classified-listing'),
        'type'    => 'multi_checkbox',
        'default' => array('facebook', 'twitter'),
        'options' => Options::social_services_options()
    ),
    'social_pages'                 => array(
        'title'   => esc_html__('Show buttons in', 'classified-listing'),
        'type'    => 'multi_checkbox',
        'default' => array('listing'),
        'options' => array(
            'listing'    => esc_html__('Listing detail page', 'classified-listing'),
            'listings'   => esc_html__('Listings page', 'classified-listing'),
            'categories' => esc_html__('Categories page', 'classified-listing'),
            'locations'  => esc_html__('Locations page', 'classified-listing')
        )
    ),
    'recaptcha_section'            => array(
        'title' => esc_html__('reCAPTCHA settings', 'classified-listing'),
        'type'  => 'title',
    ),
    'recaptcha_forms'              => array(
        'title'   => esc_html__('Enable reCAPTCHA in', 'classified-listing'),
        'type'    => 'multi_checkbox',
        'options' => Options::get_recaptcha_form_list()
    ),
    'recaptcha_site_key'           => array(
        'title' => esc_html__('Site key', 'classified-listing'),
        'type'  => 'text',
    ),
    'recaptcha_secret_key'         => array(
        'title' => esc_html__('Secret key', 'classified-listing'),
        'type'  => 'text'
    )
);

return apply_filters('rtcl_misc_settings_options', $options);
