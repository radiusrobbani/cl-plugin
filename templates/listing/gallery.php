<?php
/**
 * @author     RadiusTheme
 * @package    classified-listing/templates
 * @version    1.0.0
 *
 * @var array[] $images
 * @var array[] $videos
 * @var string  $video_url
 */


use Rtcl\Helpers\Functions;

$total_gallery_image = count($images);
$total_gallery_videos = count($videos);
$total_gallery_item = $total_gallery_image + $total_gallery_videos;
if ($total_gallery_item) :
    $owl_class = $total_gallery_item > 1 && Functions::is_gallery_slider_enabled() ? " owl-carousel" : '';
    ?>
    <div id="rtcl-slider-wrapper" class="rtcl-slider-wrapper mb-4">
        <!-- Slider -->
        <div class="rtcl-slider<?php echo esc_attr($owl_class); ?>">
            <?php
            if ($total_gallery_videos) {
                foreach ($videos as $index => $video_url) { ?>
                    <div class="rtcl-slider-item rtcl-slider-video-item">
                        <iframe class="rtcl-lightbox-iframe"
                                src="<?php echo Functions::get_sanitized_embed_url($video_url) ?>"
                                style="width: 100%; height: 400px; margin: 0;padding: 0; background-color: #000"
                                frameborder="0" webkitAllowFullScreen
                                mozallowfullscreen allowFullScreen></iframe>
                    </div>
                    <?php
                }
            }
            if ($total_gallery_image) {
                foreach ($images as $index => $image) :
                    $image_attributes = wp_get_attachment_image_src($image->ID, 'rtcl-gallery');
                    $image_full = wp_get_attachment_image_src($image->ID, 'full');
                    ?>
                    <div class="rtcl-slider-item">
                        <img src="<?php echo esc_html($image_attributes[0]); ?>"
                             data-src="<?php echo esc_attr($image_full[0]) ?>"
                             data-large_image="<?php echo esc_attr($image_full[0]) ?>"
                             data-large_image_width="<?php echo esc_attr($image_full[1]) ?>"
                             data-large_image_height="<?php echo esc_attr($image_full[2]) ?>"
                             alt="<?php echo get_the_title($image->ID); ?>"
                             data-caption="<?php echo esc_attr(wp_get_attachment_caption($image->ID)); ?>"
                             class="rtcl-responsive-img"/>
                    </div>
                <?php endforeach;
            } ?>
        </div>
        <?php if ($total_gallery_item > 1): ?>
            <!-- Slider nav -->
            <div class="rtcl-slider-nav<?php echo esc_attr($owl_class); ?>">
                <?php
                if ($total_gallery_videos) {
                    foreach ($videos as $index => $video_url) { ?>
                        <div class="rtcl-slider-thumb-item rtcl-slider-video-thumb">
                            <img src="<?php echo Functions::get_embed_video_thumbnail_url($video_url) ?>"
                                 class="rtcl-gallery-thumbnail" alt=""/>
                        </div>
                        <?php
                    }
                }
                if ($total_gallery_image) {
                    foreach ($images as $index => $image) : ?>
                        <div class="rtcl-slider-thumb-item">
                            <?php echo wp_get_attachment_image($image->ID, 'rtcl-gallery-thumbnail'); ?>
                        </div>
                    <?php endforeach;
                } ?>
            </div>
        <?php endif; ?>
    </div>
<?php endif;