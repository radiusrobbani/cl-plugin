<?php

namespace Rtcl\Controllers\Hooks;


use Rtcl\Helpers\Cache;
use Rtcl\Resources\Options;

class AdminHooks
{

    public static function init() {
        add_action("rtcl_sent_email_to_user_by_moderator", [__CLASS__, 'update_user_notification_by_moderator'], 10);
        add_action("rtcl_sent_email_to_user_by_visitor", [__CLASS__, 'update_user_notification_by_visitor'], 10);
        add_filter('rtcl_register_settings_tabs', [__CLASS__, 'add_addon_theme_tab_item_at_settings_tabs_list'], 99);
        add_action('rtcl_admin_settings_groups', [__CLASS__, 'add_addon_theme_feature'], 10, 2);
        add_action('update_option_rtcl_general_settings', [__CLASS__, 'update_taxonomy_cache_at_taxonomy_order_change'], 10, 2);
    }

    public static function update_user_notification_by_moderator($post_id) {
        $count = absint(get_post_meta($post_id, "notification_by_moderation", true));

        update_post_meta($post_id, 'notification_by_moderation', $count + 1);
    }

    public static function update_user_notification_by_visitor($post_id) {

        $count = absint(get_post_meta($post_id, "notification_by_visitor", true));

        update_post_meta($post_id, 'notification_by_visitor', $count + 1);

    }

    public static function add_addon_theme_tab_item_at_settings_tabs_list($tabs) {
        $tabs['addons'] = esc_html__('Addon & Theme', 'classified-listing');

        return $tabs;
    }

    public static function add_addon_theme_feature($active_tab, $current_section) {
        if ($active_tab === "addons") {
            $addons = Options::addons();
            ?>
            <div class="rtcl-product-list">
                <?php
                if (!empty($addons)) {
                    foreach ($addons as $addon) {
                        $addon = wp_parse_args($addon, [
                            'title'    => '',
                            'img_url'  => rtcl()->get_assets_uri('images/placeholder.jpg'),
                            'demo_url' => '',
                            'buy_url'  => '',
                        ])
                        ?>
                        <div class="rtcl-product">
                            <img alt="<?php echo esc_attr($addon['title']) ?>"
                                 src="<?php echo esc_url($addon['img_url']) ?>">
                            <div class="rtcl-product-info">
                                <h3 class="rtcl-p-title">
                                    <a target="_blank" href="<?php echo esc_url($addon['buy_url']) ?>">
                                        <?php echo esc_attr($addon['title']) ?></a>
                                </h3>
                                <div class="rtcl-p-action">
                                    <a class="rtcl-p-buy button button-primary" target="_blank"
                                       href="<?php echo esc_url($addon['buy_url']) ?>"><?php esc_html_e("Buy Now", "classified-listing"); ?></a>
                                    <a class="rtcl-p-demo button" target="_blank"
                                       href="<?php echo esc_url($addon['demo_url']) ?>"><?php esc_html_e("Live Demo", "classified-listing"); ?></a>
                                </div>
                            </div>
                        </div>
                        <?php
                    }
                }
                ?>
            </div>

            <?php
        }
    }

    public static function update_taxonomy_cache_at_taxonomy_order_change($old_options, $new_options) {
        if ((isset($old_options['taxonomy_orderby']) && isset($new_options['taxonomy_orderby']) && ($old_options['taxonomy_orderby'] !== $new_options['taxonomy_orderby'])) ||
            (isset($old_options['taxonomy_order']) && isset($new_options['taxonomy_order']) && ($old_options['taxonomy_order'] !== $new_options['taxonomy_order']))) {
            Cache::remove_all_taxonomy_cache();
        }
    }

}