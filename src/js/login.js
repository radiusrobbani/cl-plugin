;(function ($) {
    $(document).on('click', "#rtcl-resend-verify-link", function (e) {
        e.preventDefault();
        if (confirm(rtcl.re_send_confirm_text)) {
            let login = $(this).data('login'),
                parent = $(this).parent();
            $.ajax({
                url: rtcl.ajaxurl,
                data: {
                    action: 'rtcl_resend_verify',
                    user_login: login,
                    __rtcl_wpnonce: rtcl.__rtcl_wpnonce
                },
                type: "POST",
                dataType: 'JSON',
                beforeSend: function () {
                    parent.rtclBlock();
                },
                success: function (response) {
                    parent.rtclUnblock();
                    alert(response.data.message);
                },
                error: function (e) {
                    parent.rtclUnblock();
                    alert("Server Error!!!");
                }
            });
        }
        return false;
    });
})(jQuery);