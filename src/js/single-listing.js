;(function ($) {
    'user strict';

    /**
     * Listing gallery class.
     */
    const RtclListingGallery = function ($target, args) {
        this.target = $target;
        this._slider = $('.rtcl-slider', $target);
        this._slider_nav = $('.rtcl-slider-nav', $target);
        this._slider_images = $('.rtcl-slider-item', this._slider);
        this.serrings = rtcl_single_listing_localized_params || {};
        this.options = Object.assign({}, this.serrings.slider_options);
        //if rtl value was not passed and html is in rtl..enable it by default.
        if (typeof this.options.rtl == 'undefined' && $('html').attr('dir') === 'rtl') {
            this.options.rtl = true;
        }

        // Pick functionality to initialize...
        this.slider_enabled = $.isFunction($.fn.owlCarousel) && this.serrings.slider_enabled;
        this.zoom_enabled = $.isFunction($.fn.zoom) && this.serrings.zoom_enabled;
        this.photoswipe_enabled = typeof PhotoSwipe !== 'undefined' && this.serrings.photoswipe_enabled;

        // ...also taking args into account.
        if (args) {
            this.slider_enabled = false === args.slider_enabled ? false : this.slider_enabled;
            this.zoom_enabled = false === args.zoom_enabled ? false : this.zoom_enabled;
            this.photoswipe_enabled = false === args.photoswipe_enabled ? false : this.photoswipe_enabled;
        }

        if (1 === this._slider_images.length) {
            this.slider_enabled = false;
        }

        this.sliderChangeActive = function (sliderIndex) {
            this._slider_nav.find('.rtcl-slider-thumb-item.active').removeClass('active');
            this._slider_nav.find('.owl-item:eq(' + sliderIndex + ') .rtcl-slider-thumb-item').addClass('active');
            $(this).index();
        };

        this.initOwlCarousel = function () {
            if (!this.slider_enabled) {
                return;
            }
            let $slider = this._slider,
                $slider_nav = this._slider_nav,
                that = this;

            $slider
                .on('initialized.owl.carousel', function (e) {
                    if (e.relatedTarget._items[e.relatedTarget._current].find('iframe').length) {
                        e.target.classList.add('active-video-slider');
                    }
                })
                .owlCarousel({
                    items: 1,
                    dots: false,
                    autoHeight: true,
                    rtl: !!this.options.rtl,
                    nav: true,
                    navText: ['<i class="rtcl-icon-angle-left rtcl-icon-zoom-in"></i>', '<i class="rtcl-icon-angle-right"></i>'],
                })
                .on('changed.owl.carousel', function (e) {
                    $slider_nav.trigger('to.owl.carousel', [e.item.index, 300, true]);
                    that.sliderChangeActive(e.item.index);
                    that.initZoomForTarget(e.item.index);
                    e.relatedTarget._items.map((item, index) => {
                        if (index !== e.relatedTarget._current) {
                            const $iframes = item.find('iframe');
                            if ($iframes.length) {
                                $iframes.each(function () {
                                    let src = $(this).attr('src');
                                    $(this).attr('src', src);
                                });
                            }
                        }
                    });
                    if (e.relatedTarget._items[e.relatedTarget._current].find('iframe').length) {
                        e.target.classList.add('active-video-slider');
                    } else {
                        e.target.classList.remove('active-video-slider');
                    }
                });
            $slider_nav.find('.rtcl-slider-thumb-item:first-child').addClass('active');
            $slider_nav.owlCarousel({
                responsive: {
                    0: {
                        items: 4
                    },
                    200: {
                        items: 4
                    },
                    400: {
                        items: 4
                    },
                    600: {
                        items: 5
                    }
                },
                margin: 5,
                rtl: !!this.options.rtl,
                nav: true,
                navText: ['<i class="rtcl-icon-angle-left"></i>', '<i class="rtcl-icon-angle-right"></i>'],
                onInitialized: function () {
                    let $stage = $('.rtcl-slider-thumb-item .owl-stage');
                    $stage.css('width', $stage.width() + 1);
                },
                onResized: function () {
                    let $stage = $('.rtcl-slider-thumb-item .owl-stage');
                    $stage.css('width', $stage.width() + 1);
                }
            }).on('click', '.owl-item', function () {
                $slider.trigger('to.owl.carousel', [$(this).index(), 300, true]);
                that.sliderChangeActive($(this).index());
            }).on('changed.owl.carousel', function (e) {
                $slider.trigger('to.owl.carousel', [e.item.index, 300, true]);
                that.sliderChangeActive(e.item.index);
            });
        };
        this.imagesLoaded = function () {
            let that = this;

            if ($.fn.imagesLoaded.done) {
                this.target.trigger('rtcl_gallery_loading', this);
                this.target.trigger('rtcl_gallery_loaded', this);
                return;
            }

            this.target.imagesLoaded().progress(function (instance, image) {
                that.target.trigger('rtcl_gallery_loading', [that]);
            }).done(function (instance) {
                that.target.trigger('rtcl_gallery_loaded', [that]);
            });
        };
        this.initZoom = function () {
            if (!this.zoom_enabled) {
                return;
            }
            this.initZoomForTarget(0);
        };
        this.initZoomForTarget = function (sliderIndex) {
            if (!this.zoom_enabled) {
                return;
            }

            let galleryWidth = this._slider.width(),
                zoomEnabled = false,
                zoomTarget = this._slider_images.eq(sliderIndex);

            $(zoomTarget).each(function (index, element) {
                let image = $(element).find('img');
                if (parseInt(image.data('large_image_width')) > galleryWidth) {
                    zoomEnabled = true;
                    return false;
                }
            });

            // But only zoom if the img is larger than its container.
            if (zoomEnabled) {
                let zoom_options = $.extend({
                    touch: false
                }, this.serrings.zoom_options);

                if ('ontouchstart' in document.documentElement) {
                    zoom_options.on = 'click';
                }

                zoomTarget.trigger('zoom.destroy');
                zoomTarget.zoom(zoom_options);
                this.target.on('rtcl_gallery_init_zoom', this.initZoom);
            }
        };
        this.initPhotoswipe = function () {
            if (!this.photoswipe_enabled) {
                return;
            }
            this._slider.prepend('<a href="#" class="rtcl-listing-gallery__trigger"><i class="rtcl-icon-search"></i></i> </a>');
            this._slider.on('click', '.rtcl-listing-gallery__trigger', this.openPhotoswipe.bind(this));
        };
        this.getGalleryItems = function () {
            let $slides = this._slider_images,
                items = [];

            if ($slides.length > 0) {
                $slides.each(function (i, el) {
                    let img = $(el).find('img');

                    if (img.length) {
                        let large_image_src = img.attr('data-large_image'),
                            large_image_w = img.attr('data-large_image_width'),
                            large_image_h = img.attr('data-large_image_height'),
                            item = {
                                src: large_image_src,
                                w: large_image_w,
                                h: large_image_h,
                                title: img.attr('data-caption') ? img.attr('data-caption') : img.attr('title')
                            };
                        items.push(item);
                    }
                });
            }

            return items;
        };
        this.openPhotoswipe = function (e) {
            e.preventDefault();

            let pswpElement = $('.pswp')[0],
                items = this.getGalleryItems(),
                eventTarget = $(e.target),
                clicked;

            if (eventTarget.is('.rtcl-listing-gallery__trigger') || eventTarget.is('.rtcl-listing-gallery__trigger img')) {
                clicked = this._slider.find('.owl-item.active');
            } else {
                clicked = eventTarget.closest('.rtcl-slider-item');
            }

            let options = $.extend({
                index: $(clicked).index()
            }, this.serrings.photoswipe_options);

            // Initializes and opens PhotoSwipe.
            const photoswipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            photoswipe.init();
        };
        this.start = function () {
            const that = this;
            this.target.on('rtcl_gallery_loaded', this.init.bind(this));
            setTimeout(function () {
                that.imagesLoaded();
            }, 1);
        };
        this.init = function () {
            this.initOwlCarousel();
            this.initZoom();
            this.initPhotoswipe();
        };
        this.start();
    };


    $.fn.rtcl_listing_gallery = function (args) {
        new RtclListingGallery(this, args);
        return this;
    };
    $('.rtcl-slider-wrapper').each(function () {
        $(this).rtcl_listing_gallery();
    });
})(jQuery);