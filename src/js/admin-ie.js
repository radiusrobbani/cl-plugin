(function ($) {
    'use restrict';
    const responseHolder = $('<div class="response-item"><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div></div><div class="response"></div></div>');

    if ($.fn.validate) {
        const insertData = function insertData(data, action, text) {
            if (data && !data.length) {
                return;
            }

            let responseTarget = $("#import-response"),
                responseItem = responseHolder.clone(),
                responseText = $(".response", responseItem),
                processBar = $(".progress-bar", responseItem),
                btn = $("#rtcl-import-btn"),
                length = getDataLength(data),
                initPercentage = 100 / length,
                i = 1,
                percentage = 0;
            responseItem.prepend('<h5>' + text + ' importing ...</h5>');
            processBar.text("0%");
            processBar.width("0%");
            responseText.html("<div class='alert alert-info' style='height: 200px; overflow-y: scroll;'> Loading ....</div>");
            responseTarget.append(responseItem);
            btn.prop("disabled", true);

            function insertAjaxCall(dataItem) {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: rtcl.ajaxurl,
                        method: "POST",
                        data: {
                            data: dataItem,
                            action: action
                        },
                        dataType: 'json',
                        success: function success(res) {
                            const target = responseText.find('.alert');
                            percentage = percentage + initPercentage;
                            processBar.text(Math.ceil(percentage) + "%");
                            processBar.width(percentage + "%");
                            target.append('<p>' + res.message + '</p>');
                            target.scrollTop(target[0].scrollHeight - target.outerHeight());
                            resolve(res);
                        },
                        error: function error(jqXHR, textStatus, errorThrown) {
                            percentage = percentage + initPercentage;
                            processBar.text(Math.ceil(percentage) + "%");
                            processBar.width(percentage + "%");
                            reject(textStatus);
                        }
                    })
                });
            }

            async function insertDataItem(dataItem, parent) {
                if (dataItem !== undefined && dataItem.length) {
                    for (let index = 0; index < dataItem.length; index++) {
                        const item = dataItem[index];
                        if (parent && !item.parent) {
                            item.parent = parent;
                        }
                        let itemObj = Object.assign({}, item);
                        if (itemObj.child) {
                            delete itemObj.child;
                        }
                        const response = await insertAjaxCall(itemObj);
                        if (response.success && item.child) {
                            insertDataItem(item.child, response.data.term_id);
                        }
                        if (i === dataItem.length) {
                            btn.prop("disabled", false);
                        }
                        i++;
                    }
                }
            }

            insertDataItem(data);
        };

        function getDataLength(data) {
            let length = data !== undefined ? data.length : 0;
            if (length) {
                data.forEach(function (item, index) {
                    if (item.child) {
                        length += getDataLength(item.child);
                    }
                });
            }

            return length;
        }

        $("#rtcl-import-file").on('change', function (e) {
            const self = $(this);
            self.parent('.custom-file').find('.custom-file-label').text(self.val());
            $("#rtcl-import-form").validate();
        }); // Listing validation

        $("#rtcl-import-form").validate({
            submitHandler: function submitHandler(form) {
                let file = $("#rtcl-import-form").find('#rtcl-import-file')[0].files[0];
                let reader = new FileReader();

                if (file.type === "application/json") {
                    reader.onload = function (event) {
                        const obj = JSON.parse(event.target.result);
                        $("#import-response").html('');
                        const locations = obj.locations;
                        const categories = obj.categories;
                        insertData(locations, 'rtcl_import_location', 'Location');
                        insertData(categories, 'rtcl_import_category', 'Category');
                        // $(window).bind('beforeunload', function () {
                        //     alert("Are you sure to close window");
                        // });
                    };

                    reader.readAsText(file);
                }
            }
        });
    }

})(jQuery);