<?php
/**
 * Loop Price
 *
 * This template can be overridden by copying it to yourtheme/classified-listing/loop/price.php.
 *
 *
 * @package classified-listing/Templates
 * @version 1.5
 */

if (!defined('ABSPATH')) {
    exit;
}

global $listing;

if (!$listing || !$listing->can_show_price()) {
    return;
}

if ($price_html = $listing->get_price_html()) : ?>
    <div class="item-price listing-price"><?php echo $price_html; ?></div>
<?php endif; ?>

