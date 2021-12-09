(function ($) {
    $(document)
        .on('change', '.rtcl-widget-listings-view select', function () {
            var _this = $(this),
                view = _this.val(),
                target = _this.parents('.widget-content');
            if ("map" === view) {
                target.find('.rtcl-general-item').slideUp(250);
            } else if("slider" === view) {
                target.find('.rtcl-general-item').slideDown(250);
            }else{
                target.find('.rtcl-general-item:not(.rtcl-slider-item)').slideDown(250);
                target.find('.rtcl-slider-item').slideUp(250);
            }
        });
})(jQuery);