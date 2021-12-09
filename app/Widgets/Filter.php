<?php

namespace Rtcl\Widgets;


use Rtcl\Helpers\Functions;
use Rtcl\Helpers\Text;
use Rtcl\Models\WidgetFields;
use Rtcl\Resources\Options;
use WP_Term;
use WP_Widget;

/**
 * Class Filter
 *
 * @package Rtcl\Widgets
 */
class Filter extends WP_Widget
{

    protected $widget_slug;
    protected $instance;

    public function __construct() {

        $this->widget_slug = 'rtcl-widget-filter';

        parent::__construct(
            $this->widget_slug,
            esc_html__('Classified Listing Filter', 'classified-listing'),
            [
                'classname'   => 'rtcl ' . $this->widget_slug . '-class',
                'description' => esc_html__('Classified listing Filter.', 'classified-listing')
            ]
        );
    }

    /**
     * @param array $args
     * @param array $instance
     */
    public function widget($args, $instance) {
        $this->instance = $instance;
        global $wp;
        $queried_object = get_queried_object();
        foreach ([rtcl()->location, rtcl()->category] as $taxonomy) {
            if (is_a($queried_object, WP_Term::class) && $queried_object->taxonomy === $taxonomy) {
                $queried_object = clone $queried_object;
                unset($queried_object->description);
                $this->instance['current_taxonomy'][$taxonomy] = clone $queried_object;
            } else {
                $q_term = $term = '';
                if (isset($wp->query_vars[$taxonomy])) {
                    $q_term = explode('/', $wp->query_vars[$taxonomy]);
                    $q_term = end($q_term);
                }
                if ($q_term && $term = get_term_by('slug', $q_term, $taxonomy)) {
                    $term = clone $term;
                    unset($term->description);
                }
                $this->instance['current_taxonomy'][$taxonomy] = $term;
            }
        }
        $data = array(
            'category_filter'       => $this->get_category_filter(),
            'location_filter'       => $this->get_location_filter(),
            'ad_type_filter'        => $this->get_ad_type_filter(),
            'price_filter'          => $this->get_price_filter(),
            'object'                => $this,
            'template'              => "widgets/filter",
            'default_template_path' => null,
        );

        $data = apply_filters('rtcl_widget_filter_values', $data, $args, $instance, $this);
        $data['data'] = $data;

        echo $args['before_widget'];

        if (!empty($instance['title'])) {
            echo $args['before_title'] . apply_filters('widget_title', $instance['title']) . $args['after_title'];
        }

        Functions::get_template($data['template'], $data, '', $data['default_template_path']);

        echo $args['after_widget'];
    }

    public function get_instance() {
        return $this->instance;
    }

    /**
     * @param array $new_instance
     * @param array $old_instance
     *
     * @return array
     */
    public function update($new_instance, $old_instance) {

        $instance = $old_instance;

        $instance['title'] = !empty($new_instance['title']) ? strip_tags($new_instance['title']) : '';
        $instance['search_by_category'] = !empty($new_instance['search_by_category']) ? 1 : 0;
        $instance['search_by_location'] = !empty($new_instance['search_by_location']) ? 1 : 0;
        $instance['search_by_ad_type'] = !empty($new_instance['search_by_ad_type']) ? 1 : 0;
        $instance['search_by_price'] = !empty($new_instance['search_by_price']) ? 1 : 0;
        $instance['hide_empty'] = !empty($new_instance['hide_empty']) ? 1 : 0;
        $instance['show_count'] = !empty($new_instance['show_count']) ? 1 : 0;
        $instance['ajax_load'] = !empty($new_instance['ajax_load']) ? 1 : 0;
        $instance['taxonomy_reset_link'] = !empty($new_instance['taxonomy_reset_link']) ? 1 : 0;
        return apply_filters('rtcl_widget_filter_update_values', $instance, $new_instance, $old_instance, $this);
    }

    /**
     * @param array $instance
     *
     * @return void
     */
    public function form($instance) {

        // Define the array of defaults
        $defaults = array(
            'title'               => esc_html__('Filter', 'classified-listing'),
            'search_by_category'  => 1,
            'search_by_location'  => 1,
            'search_by_ad_type'   => 1,
            'search_by_price'     => 1,
            'hide_empty'          => 0,
            'show_count'          => 1,
            'ajax_load'           => 1,
            'taxonomy_reset_link' => 1,
        );

        // Parse incoming $instance into an array and merge it with $defaults
        $instance = wp_parse_args(
            (array)$instance,
            apply_filters('rtcl_widget_filter_default_values', $defaults, $instance, $this)
        );
        $fields = Options::widget_filter_fields();
        $widgetFields = new WidgetFields($fields, $instance, $this);
        $widgetFields->render();
    }

    public function get_category_filter() {
        if (!empty($this->instance['search_by_category'])) {
            $args = [
                'taxonomy' => rtcl()->category,
                'parent'   => 0,
                'instance' => $this->instance
            ];
            return sprintf('<div class="rtcl-category-filter ui-accordion-item is-open">
					                <a class="ui-accordion-title">
					                    <span>%s</span>
					                    <span class="ui-accordion-icon rtcl-icon rtcl-icon-anchor"></span>
					                </a>
					                <div class="ui-accordion-content%s"%s>%s</div>
					            </div>',
                apply_filters('rtcl_widget_filter_category_title', esc_html__("Category", "classified-listing")),
                !empty($args['instance']['ajax_load']) ? ' rtcl-ajax-load' : '',
                !empty($args['instance']['ajax_load']) ? sprintf(' data-settings="%s"', htmlspecialchars(wp_json_encode($args))) : '',
                empty($args['instance']['ajax_load']) ? Functions::get_sub_terms_filter_html($args) : ""
            );
        }
    }

    /**
     * @return null|string
     */
    public function get_location_filter() {

        if ('google' === apply_filters('rtcl_location_type', 'local')) {
            return '';
        }

        if (!empty($this->instance['search_by_location'])) {
            $args = array(
                'taxonomy' => rtcl()->location,
                'parent'   => 0,
                'instance' => $this->instance
            );

            return sprintf('<div class="rtcl-location-filter ui-accordion-item is-open">
					                <a class="ui-accordion-title">
					                    <span>%s</span>
					                    <span class="ui-accordion-icon rtcl-icon rtcl-icon-anchor"></span>
					                </a>
					                <div class="ui-accordion-content%s"%s>%s</div>
					            </div>',
                apply_filters('rtcl_widget_filter_location_title', esc_html__("Location", "classified-listing")),
                !empty($args['instance']['ajax_load']) ? ' rtcl-ajax-load' : '',
                !empty($args['instance']['ajax_load']) ? sprintf(' data-settings="%s"', htmlspecialchars(wp_json_encode($args))) : '',
                empty($args['instance']['ajax_load']) ? Functions::get_sub_terms_filter_html($args) : ""
            );
        }
    }

    /**
     * @return string
     */
    public function get_ad_type_filter() {
        if (!empty($this->instance['search_by_ad_type']) && !Functions::is_ad_type_disabled()) {
            $filters = !empty($_GET['filters']) ? $_GET['filters'] : array();
            $ad_type = !empty($filters['ad_type']) ? esc_attr($filters['ad_type']) : null;
            $field_html = "<ul class='ui-link-tree is-collapsed'>";
            $ad_types = Functions::get_listing_types();
            if (!empty($ad_types)) {
                foreach ($ad_types as $key => $option) {
                    $checked = ($ad_type == $key) ? " checked " : '';
                    $field_html .= "<li class='ui-link-tree-item ad-type-{$key}'>";
                    $field_html .= "<input id='filters-ad-type-values-{$key}' name='filters[ad_type]' {$checked} value='{$key}' type='radio' class='ui-checkbox filter-submit-trigger'>";
                    $field_html .= "<a href='#' class='filter-submit-trigger'>" . Text::string_translation($option) . "</a>";
                    $field_html .= "</li>";
                }
            }
            $field_html .= '<li class="is-opener"><span class="rtcl-more"><i class="rtcl-icon rtcl-icon-plus-circled"></i><span class="text">' . __("Show More",
                    "classified-listing") . '</span></span></li>';
            $field_html .= "</ul>";

            return sprintf('<div class="rtcl-ad-type-filter ui-accordion-item is-open">
									                <a class="ui-accordion-title">
									                    <span>%s</span>
									                    <span class="ui-accordion-icon rtcl-icon rtcl-icon-anchor"></span>
									                </a>
									                <div class="ui-accordion-content">%s</div>
									            </div>',
                apply_filters('rtcl_widget_filter_ad_type_title', esc_html__("Type", "classified-listing")),
                $field_html
            );
        }
    }

    /**
     * @return string
     */
    public function get_price_filter() {
        if (!empty($this->instance['search_by_price'])) {
            $filters = !empty($_GET['filters']) ? $_GET['filters'] : array();
            $fMinValue = !empty($filters['price']['min']) ? esc_attr($filters['price']['min']) : null;
            $fMaxValue = !empty($filters['price']['max']) ? esc_attr($filters['price']['max']) : null;
            $field_html = sprintf('<div class="form-group">
							            <div class="row">
							                <div class="col-md-6 col-6">
							                    <input type="number" name="filters[price][min]" class="form-control" placeholder="%s" value="%s">
							                </div>
							                <div class="col-md-6 col-6">
							                    <input type="number" name="filters[price][max]" class="form-control" placeholder="%s" value="%s">
							                </div>
							            </div>
							        </div>',
                esc_html__('min', 'classified-listing'),
                $fMinValue,
                esc_html__('max', 'classified-listing'),
                $fMaxValue
            );

            return sprintf('<div class="rtcl-price-filter ui-accordion-item is-open">
									                <a class="ui-accordion-title">
									                    <span>%s</span>
									                    <span class="ui-accordion-icon rtcl-icon rtcl-icon-anchor"></span>
									                </a>
									                <div class="ui-accordion-content">%s</div>
									            </div>',
                apply_filters('rtcl_widget_filter_price_title', esc_html__("Price Range", "classified-listing")),
                $field_html
            );
        }
    }

}
