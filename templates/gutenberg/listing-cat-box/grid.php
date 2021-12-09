<?php

/**
 * @author    RadiusTheme
 * @version       1.0.0
 */

use Rtcl\Helpers\Functions;

?>

<div class="rtcl rtcl-cat-box-gutenberg rtcl-categories rtcl-categories-grid<?php echo esc_attr($settings['equal_height'] ? ' rtcl-equal-height' : ''); ?> <?php echo esc_attr($settings['align'] ? 'align' . $settings['align'] : ''); ?>">
	<div class="row rtcl-no-margin">

		<?php
		$classes  = 'col-xl-' . $settings['col_xl'];
		$classes .= ' col-lg-' . $settings['col_lg'];
		$classes .= ' col-md-' . $settings['col_md'];
		$classes .= ' col-sm-' . $settings['col_sm'];
		$classes .= ' col-xs-' . $settings['col_mobile'];
		?>

		<?php
		if (!empty($results)) :
			foreach ($results as $result) : ?>
				<div class="cat-item-wrap equal-item <?php echo esc_attr($classes) ?>">
					<a href="<?php echo esc_attr($result['permalink']); ?>" class="cat-details text-center">	
						<?php if(!empty($result['icon_html'])): ?>
							<div class="icon"><?php echo wp_kses_post($result['icon_html']); ?></div>
						<?php endif; ?>

						<h3 class="title"><?php echo $result['name'] ?></h3>

						<?php
						if (!empty($result['count'])) {
							printf("<div class='counter'>(%d)</div>", absint($result['count']));
						}

						if (!empty($result['description']) && $settings['catdesc'] ) {
							$word_limit = wp_trim_words($result['description'], $settings['content_limit']);
							printf('<p>%s</p>', esc_html($word_limit));
						}
						?>
					</a>
				</div>
		<?php endforeach;
		endif;
		?>

	</div>
</div>