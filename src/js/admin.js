;(function ($) {
    'use restrict';

    $.fn.getType = function () {
        return this[0].tagName == "INPUT" ? this[0].type.toLowerCase() : this[0].tagName.toLowerCase();
    };
    let spinner = '<div class="rtcl-spinner block"><span class="rtcl-icon-spinner animate-spin"></span></div>';
    $(document.body)
        .on('rtcl_add_error_tip', function (e, element, error_type) {
            let offset = element.position();

            if (element.parent().find('.rtcl_error_tip').length === 0) {
                element.after('<div class="rtcl_error_tip ' + error_type + '">' + rtcl[error_type] + '</div>');
                element.parent().find('.rtcl_error_tip')
                    .css('left', offset.left + element.width() - (element.width() / 2) - ($('.rtcl_error_tip').width() / 2))
                    .css('top', offset.top + element.height())
                    .fadeIn('100');
            }
        })
        .on('rtcl_remove_error_tip', function (e, element, error_type) {
            element.parent().find('.rtcl_error_tip.' + error_type).fadeOut('100', function () {
                $(this).remove();
            });
        })
        .on('click', function () {
            $('.rtcl_error_tip').fadeOut('100', function () {
                $(this).remove();
            });
        })
        .on('blur', '#rtcl-price[type=text],#rtcl-pricing-price[type=text], input.rtcl-price', function () {
            $('.rtcl_error_tip').fadeOut('100', function () {
                $(this).remove();
            });
        })
        .on('keyup', '#rtcl-price[type=text], #rtcl-pricing-price[type=text], input.rtcl-price', function () {
            let id = $(this).attr('id'),
                decimal_point = rtcl.decimal_point,
                error = 'i18n_mon_decimal_error';
            if (id === 'rtcl-pricing-price') {
                decimal_point = rtcl.pricing_decimal_point;
                error = 'i18n_mon_pricing_decimal_error';
            }
            let regex = new RegExp('[^\-0-9\%\\' + decimal_point + ']+', 'gi');

            let value = $(this).val();
            let newvalue = value.replace(regex, '');

            if (value !== newvalue) {
                $(document.body).triggerHandler('rtcl_add_error_tip', [$(this), error]);
            } else {
                $(document.body).triggerHandler('rtcl_remove_error_tip', [$(this), error]);
            }
        })
        .on('change', '#rtcl-price[type=text],#rtcl-pricing-price[type=text], input.rtcl-price', function () {
            let id = $(this).attr('id'),
                decimal_point = id === 'rtcl-pricing-price' ? rtcl.pricing_decimal_point : rtcl.decimal_point;

            let regex = new RegExp('[^\-0-9\%\\' + decimal_point + ']+', 'gi'),
                value = $(this).val(),
                newvalue = value.replace(regex, '');

            if (value !== newvalue) {
                $(this).val(newvalue);
            }
        })
        .on('rtcl_price_type_changed', function (e, element) {
            if (element.value === "on_call" || element.value === "free" || element.value === "no_price") {
                $('#rtcl-price').attr("required", "false").val('');
            } else {
                $('#rtcl-price').attr("required", "true");
            }
            $("#rtcl-price-items")
                .removeClass(function (index, className) {
                    return (className.match(/(^|\s)rtcl-price-type\S+/g) || []).join(' ');
                })
                .addClass('rtcl-price-type-' + element.value);
        })
        .on('rtcl_listing_pricing_type_changed', function (e, element) {
            $("#rtcl-pricing-items")
                .removeClass()
                .addClass('rtcl-pricing-' + element.value);
        })
        .on('change', '#rtcl-price-type', function () {
            $(document.body).trigger('rtcl_price_type_changed', [this]);
        })
        .on('change', 'input[name=_rtcl_listing_pricing]', function () {
            $(document.body).trigger('rtcl_listing_pricing_type_changed', [this]);
        });

    /**
     * Update price unit depends on category
     * @param cat_id
     */
    function load_price_units(cat_id) {
        var $target = $('#rtcl-price-items'),
            units_wrap = $("#rtcl-price-unit-wrap", $target),
            has_units = units_wrap.length,
            data = {
                'action': 'rtcl_get_price_units_ajax',
                'term_id': cat_id || 0
            };
        $.ajax({
            url: ajaxurl,
            data: data,
            type: "POST",
            dataType: 'json',
            beforeSend: function beforeSend() {
            },
            success: function success(data) {
                if (data.html) {
                    if (has_units) {
                        units_wrap.remove();
                    }
                    $target.append(data.html);
                } else {
                    units_wrap.remove();
                }
            },
            error: function error() {
            }
        });
    }

    const RtclTimeStamp = function ($target) {
        this._target = $target;
        this.timestampdiv = $('.rtcl-timestamp-div', this._target);
        this.timestamp = $('.rtcl-timestamp', this._target);
        this.stamp = this.timestamp.html();
        this.timestampwrap = this.timestampdiv.find('.timestamp-wrap');
        this.edittimestamp = this.timestampdiv.siblings('a.edit-timestamp');

        this.init = function () {
            const that = this;
            this.edittimestamp.on('click', function (event) {
                if (that.timestampdiv.is(':hidden')) {
                    // Slide down the form and set focus on the first field.
                    that.timestampdiv.slideDown('fast', function () {
                        $('input, select', that.timestampwrap).first().focus();
                    });
                    $(this).hide();
                }
                event.preventDefault();
            });

            this.timestampdiv.find('.cancel-timestamp').on('click', function (event) {
                // Move focus back to the Edit link.
                that.edittimestamp.show().focus();
                that.timestampdiv.slideUp('fast');
                that.timestampdiv.find('.rtcl-mm').val(that.timestampdiv.find('.rtcl-hidden_mm').val());
                that.timestampdiv.find('.rtcl-jj').val(that.timestampdiv.find('.rtcl-hidden_jj').val());
                that.timestampdiv.find('.rtcl-aa').val(that.timestampdiv.find('.rtcl-hidden_aa').val());
                that.timestampdiv.find('.rtcl-hh').val(that.timestampdiv.find('.rtcl-hidden_hh').val());
                that.timestampdiv.find('.rtcl-mn').val(that.timestampdiv.find('.rtcl-hidden_mn').val());
                that.timestamp.html(that.stamp);
                event.preventDefault();
            });
            this.timestampdiv.find('.save-timestamp').on('click', function (event) { // crazyhorse - multiple ok cancels
                let aa = that.timestampdiv.find('.rtcl-aa').val(),
                    mm = that.timestampdiv.find('.rtcl-mm').val(),
                    jj = that.timestampdiv.find('.rtcl-jj').val(),
                    hh = that.timestampdiv.find('.rtcl-hh').val(),
                    mn = that.timestampdiv.find('.rtcl-mn').val(),
                    newD = new Date(aa, mm - 1, jj, hh, mn);

                event.preventDefault();

                if (newD.getFullYear() != aa || (1 + newD.getMonth()) != mm || newD.getDate() != jj || newD.getMinutes() != mn) {
                    that.timestampwrap.addClass('form-invalid');
                    return;
                } else {
                    that.timestampwrap.removeClass('form-invalid');
                }

                that.timestamp.html(
                    rtcl.expiredOn + ' <b>' +
                    rtcl.dateFormat
                        .replace('%1$s', $('option[value="' + mm + '"]', '#mm').attr('data-text'))
                        .replace('%2$s', parseInt(jj, 10))
                        .replace('%3$s', aa)
                        .replace('%4$s', ('00' + hh).slice(-2))
                        .replace('%5$s', ('00' + mn).slice(-2)) +
                    '</b> '
                );

                // Move focus back to the Edit link.
                that.edittimestamp.show().focus();
                that.timestampdiv.slideUp('fast');
            });
        };
        this.init();
    };

    $.fn.rtcl_time_stamp = function () {
        $(this).each(function () {
            return new RtclTimeStamp($(this));
        });
    };
    $('.rtcl-timestamp-wrapper').rtcl_time_stamp();


    $(".misc-pub-rtcl-never-expires")
        .on('click', 'input', function () {
            if ($(this).is(':checked')) {
                $(".misc-pub-rtcl-expiration-time").hide();
            } else {
                $(".misc-pub-rtcl-expiration-time").show();
            }
        });

    $('#rtcl-ad-type')
        .on('change', function () {
            let self = $(this),
                type = self.val(),
                category_wrap = $('#rtcl-category-wrap'),
                target = $("#rtcl-price-items"),
                blank_select = $('<select class="form-control" id="rtcl-category-of-type" name="rtcl-category-of-type" required />');
            target.find('.price-label .rtcl-per-unit').remove();
            if (type === 'to_let') {
                let unit = target.find('label').attr("data-per-unit");
                target.find('.price-label').append('<span class="rtcl-per-unit"> / ' + unit + '</span>');
            }
            if (type === '') {
                $("#rtcl-pricing-wrap").slideUp(250);
            } else {
                $("#rtcl-pricing-wrap").slideDown(250);
            }

            if (type) {
                let data = {
                    'action': 'rtcl_get_one_level_category_select_list_by_type',
                    'type': type
                };
                $.ajax({
                    url: rtcl.ajaxurl,
                    data: data,
                    type: "POST",
                    beforeSend: function () {
                        $(spinner).insertAfter(self);
                        $('#rtcl-custom-fields-list').html('');
                        category_wrap.html(blank_select);
                    },
                    success: function (response) {
                        self.next('.rtcl-spinner').remove();
                        if (response.success) {
                            category_wrap.html(blank_select.append(response.cats));
                        }
                    },
                    error: function (e) {
                        self.next('.rtcl-spinner').remove();
                        console.log(e.responseText);
                    }
                });
            } else {
                $('#rtcl-custom-fields-list').html('');
                category_wrap.html(blank_select);
            }
        });
    $(document)
        .on('change', '#rtcl-category-wrap select', function () {
            let self = $(this),
                target = self.parents('#rtcl-category-wrap'),
                inputTarget = $('#rtcl-category-input'),
                custom_field_wrap = $('#rtcl-custom-fields-list'),
                category_id = $(this).val(),
                msgHolder = $("<div class='alert rtcl-response'></div>"),
                data = {
                    'action': 'rtcl_custom_fields_listings',
                    'post_id': $('#rtcl-custom-fields-list').data('post_id'),
                    'term_id': category_id,
                    'is_admin': rtcl.is_admin
                };

            if (category_id) {
                inputTarget.val(category_id);
                $.ajax({
                    url: rtcl.ajaxurl,
                    data: data,
                    type: "POST",
                    dataType: 'json',
                    beforeSend: function beforeSend() {
                        $(spinner).insertAfter(self);
                        target.find('.alert.rtcl-response').remove();
                        self.nextAll('select').remove();
                    },
                    success: function success(response) {
                        target.find('.rtcl-spinner').remove();
                        if (response.child_cats) {
                            target.append($('<select class="form-control" id="rtcl-category-of-' + category_id + '" name="rtcl-category-of-' + category_id + '" required />').append(response.child_cats));
                        }
                        custom_field_wrap.html(response.custom_fields);
                        rtclInitDateField();
                        rtclRenderCFfConditions();
                    },
                    error: function error(e) {
                        target.find('.rtcl-spinner').remove();
                        msgHolder.removeClass('alert-success').addClass('alert-danger').html(e.responseText).appendTo(target);
                    }
                });
            } else {
                self.nextAll('select').remove();
            }
            load_price_units(category_id);
        });

    if ($.fn.validate) {
        // Listing validation
        $(".post-type-rtcl_listing #post").validate();
        // Pricing validation
        $(".post-type-rtcl_pricing #post").validate();
    }

    $("#send-email-to-user").on('click', function (e) {
        e.preventDefault();
        let dialog = $('<div style="display:none;height:450px;" id="user-message"><div class="form-group"><textarea class="rtcl-form-control" rows="6"></textarea></div><a class="message-send button button-primary button-large">Send</a></div>').appendTo('body');
        dialog.dialog({
            close: function (event, ui) {
                dialog.remove();
            },
            open: function (event, ui) {
                $('#user-message').parent('.ui-dialog').css('zIndex', 9999)
                    .nextAll('.ui-widget-overlay').css('zIndex', 9998);
            },
            closeText: false,
            modal: true,
            maxWidth: 850,
            zIndex: 9999,
            maxHeight: .9 * $(window).height(),
            title: "Message",
            position: {my: "center top+50", at: "center top", of: window}
        });

        dialog.on('click', 'a.message-send', function (e) {
            e.preventDefault();

            let it = $(this),
                post_id = $("#post_ID").val(),
                message = dialog.find("textarea").val();
            if (post_id && message) {
                let data = {
                    action: "rtcl_send_email_to_user_by_moderator",
                    post_id: post_id,
                    message: message,
                    __rtcl_wpnonce: rtcl.__rtcl_wpnonce
                };
                $.ajax({
                    type: "POST",
                    url: rtcl.ajaxurl,
                    data: data,
                    beforeSend: function () {
                        $(".rtcl-flash-messages").remove();
                        it.addClass('disabled').attr('disabled', "disabled");
                        $('<span class="rtcl-icon-spinner animate-spin"></span>').insertAfter(it);
                    },
                    success: function (data) {
                        it.removeClass('disabled');
                        $('.rtcl-icon-spinner', dialog).remove();
                        let flash = $("<div class='rtcl-flash-messages'>" + data.message + "</div>");
                        flash.insertAfter(it);
                        flash.addClass(data.class);
                        if (!data.error) {
                            setTimeout(function () {
                                dialog.dialog('close');
                            }, 1000)
                        } else {
                            it.removeAttr("disabled");
                        }
                    },
                    error: function (jqXHR, exception) {
                        $('.rtcl-icon-spinner', dialog).remove();
                        dialog.dialog('close');
                        it.removeAttr("disabled");
                        if (jqXHR.status === 0) {
                            alert('Not connect.\n Verify Network.');
                        } else if (jqXHR.status == 404) {
                            alert('Requested page not found. [404]');
                        } else if (jqXHR.status == 500) {
                            alert('Internal Server Error [500].');
                        } else if (exception === 'parsererror') {
                            alert('Requested JSON parse failed.');
                        } else if (exception === 'timeout') {
                            alert('Time out error.');
                        } else if (exception === 'abort') {
                            alert('Ajax request aborted.');
                        } else {
                            alert('Uncaught Error.\n' + jqXHR.responseText);
                        }
                    }
                });

            } else {
                alert("Please add some message!!");
            }

            return false;
        });


        return false;
    });

    window.rtclInitDateField = function () {
        if ($.fn.daterangepicker) {
            $('.rtcl-date').each(function () {
                var options = $(this).data('options') || {};
                $(this).daterangepicker(options);
            });
        }
    };


    /* Ready function */
    $(function () {
        $("#rtcl-overwrite").on("change", function () {
            var overwrite_item = $(".rtcl-overwrite-item").find('input');
            if (this.checked) {
                overwrite_item.prop("disabled", false);
            } else {
                overwrite_item.prop("disabled", true);
            }
        });
        rtclInitDateField();
        if ($.fn.select2) {
            $('.rtcl-select2').select2({
                dropdownAutoWidth: true,
                width: '100%'
            });
            if ($.fn.select2) {
                $('.rtcl-select2').select2({
                    dropdownAutoWidth: true,
                    width: '100%'
                });

                $('.rtcl-ajax-select').each(function () {
                    let select2_args = {
                        allowClear: !!$(this).data('allow_clear'),
                        placeholder: $(this).data('placeholder') || '',
                        minimumInputLength: $(this).data('minimum_input_length') ? $(this).data('minimum_input_length') : '1',
                        escapeMarkup: function (m) {
                            return m;
                        },
                        ajax: {
                            url: rtcl.ajaxurl,
                            type: "POST",
                            dataType: 'json',
                            delay: 1000,
                            data: function (params) {
                                return {
                                    term: params.term,
                                    type: $(this).data('type') || '',
                                    action: $(this).data('action') || 'rtcl_json_search_taxonomy',
                                    __rtcl_wpnonce: rtcl.__rtcl_wpnonce
                                };
                            },
                            processResults: function (data) {
                                let terms = [];
                                if (data) {
                                    $.each(data, function (i, item) {
                                        terms.push({
                                            id: item.id,
                                            text: item.text || item.label
                                        });
                                    });
                                }
                                return {
                                    results: terms
                                };
                            },
                            cache: true
                        }
                    };

                    // select2_args = $.extend( select2_args, getEnhancedSelectFormatString() );

                    $(this).select2(select2_args).addClass('enhanced');

                    if ($(this).data('sortable')) {
                        var $select = $(this);
                        var $list = $(this).next('.select2-container').find('ul.select2-selection__rendered');

                        $list.sortable({
                            placeholder: 'ui-state-highlight select2-selection__choice',
                            forcePlaceholderSize: true,
                            items: 'li:not(.select2-search__field)',
                            tolerance: 'pointer',
                            stop: function () {
                                $($list.find('.select2-selection__choice').get().reverse()).each(function () {
                                    var id = $(this).data('data').id;
                                    var option = $select.find('option[value="' + id + '"]')[0];
                                    $select.prepend(option);
                                });
                            }
                        });
                    }
                });
            }
        }

        if ($("#expiry-date").length) {
            $('#expiry-date').datetimepicker();
        }

        // First level
        $('#rtcl-location').on('change', function () {
            let self = $(this),
                data = {
                    'action': 'rtcl_get_sub_location_options',
                    'term_id': $(this).val(),
                    'blank': true
                };
            $.ajax({
                url: ajaxurl,
                data: data,
                type: 'POST',
                beforeSend: function () {
                    $(spinner).insertAfter(self);
                },
                success: function (data) {
                    self.next('.rtcl-spinner').remove();
                    $('#rtcl-sub-location').html(data.locations);
                    $('#rtcl-sub-sub-location').html('').addClass('rtcl-hide');
                    if (data.locations) {
                        $('#sub-location-row').removeClass('rtcl-hide');
                    } else {
                        $('#sub-location-row').addClass('rtcl-hide');
                    }
                },
                error: function () {
                    self.next('.rtcl-spinner').remove();
                }
            });
        });

        // Second level
        $('#rtcl-sub-location').on('change', function () {
            let self = $(this),
                data = {
                    'action': 'rtcl_get_sub_location_options',
                    'term_id': $(this).val(),
                    'blank': true
                };
            $.ajax({
                url: ajaxurl,
                data: data,
                type: 'POST',
                beforeSend: function () {
                    $(spinner).insertAfter(self);
                },
                success: function (data) {
                    self.next('.rtcl-spinner').remove();
                    $('#rtcl-sub-sub-location').html(data.locations);
                    if (data.locations) {
                        $('#sub-sub-location-row').removeClass('rtcl-hide');
                    } else {
                        $('#sub-sub-location-row').addClass('rtcl-hide');
                    }
                },
                error: function () {
                    self.next('.rtcl-spinner').remove();
                }
            });
        });
        if ($('body').hasClass('post-type-rtcl_listing')) {
            fix_wp_561_window_unload_error_fix();
        }
    });

    function fix_wp_561_window_unload_error_fix() {
        // Check screen
        if (typeof window.wp.autosave === 'undefined')
            return;

        // Data Hack
        var initialCompareData = {
            post_title: $('#title').val() || '',
            content: $('#content').val() || '',
            excerpt: $('#excerpt').val() || ''
        };

        var initialCompareString = window.wp.autosave.getCompareString(initialCompareData);

        // Fixed postChanged()
        window.wp.autosave.server.postChanged = function () {

            var changed = false;

            // If there are TinyMCE instances, loop through them.
            if (window.tinymce) {
                window.tinymce.each(['content', 'excerpt'], function (field) {
                    var editor = window.tinymce.get(field);

                    if (!editor || editor.isHidden()) {
                        if (($('#' + field).val() || '') !== initialCompareData[field]) {
                            changed = true;
                            // Break.
                            return false;
                        }
                    } else if (editor.isDirty()) {
                        changed = true;
                        return false;
                    }
                });

                if (($('#title').val() || '') !== initialCompareData.post_title) {
                    changed = true;
                }

                return changed;
            }

            return window.wp.autosave.getCompareString() !== initialCompareString;

        }
    }

})(jQuery);

(function ($) {
    // on dialogopen
    $(document)
        .on('dialogopen', '.ui-dialog', function (e, ui) {
            // normalize primary buttons
            $('button.button-primary, button.wpcf-ui-dialog-cancel')
                .blur()
                .addClass('button')
                .removeClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only');
        });

    // resize
    let resizeTimeout;
    $(window)
        .on('resize scroll', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(dialogResize, 200);
        });

    function dialogResize() {
        $('.ui-dialog').each(function () {
            $(this).css({
                'maxWidth': '100%',
                'zIndex': 9999,
                'top': $(window).scrollTop() + 50 + 'px',
                'left': ($('body').innerWidth() - $(this).outerWidth()) / 2 + 'px'
            });
        });
    }

    /**
     * Payment Notes Panel
     */
    const rtcl_meta_boxes_payment_notes = {
        init: function () {
            $('#rtcl-order-notes')
                .on('click', 'button.add-note', this.add_order_note)
                .on('click', 'a.delete_note', this.delete_order_note);
        },

        add_order_note: function () {
            const paymentNote = $('textarea#rtcl-add-payment-note');
            if (!paymentNote.val()) {
                return;
            }

            $('#rtcl-order-notes').rtclBlock();

            const data = {
                action: 'rtcl_add_order_note',
                post_id: parseInt($('#post_ID').val(), 10) || 0,
                note: paymentNote.val(),
                note_type: $('select#rtcl-order-note-type').val(),
                __rtcl_wpnonce: rtcl.__rtcl_wpnonce
            };

            $.post(rtcl.ajaxurl, data, function (response) {
                $('ul.rtcl_payment_notes').prepend(response.html);
                $('#rtcl-order-notes').rtclUnblock();
                $('#rtcl-add-payment-note').val('');
            });

            return false;
        },

        delete_order_note: function () {
            if (window.confirm(rtcl.i18n_delete_note)) {
                const note = $(this).closest('li.note');
                $(note).rtclBlock();

                const data = {
                    action: 'rtcl_delete_order_note',
                    note_id: $(note).attr('rel'),
                    __rtcl_wpnonce: rtcl.__rtcl_wpnonce
                };

                $.ajax({
                    url: rtcl.ajaxurl,
                    data: data,
                    type: "POST",
                    dataType: 'json',
                    beforeSend: function beforeSend() {
                    },
                    success: function success(res) {
                        if (res.success) {
                            $(note).remove();
                        }
                    }
                });
            }

            return false;
        }
    };

    rtcl_meta_boxes_payment_notes.init();
})(jQuery);