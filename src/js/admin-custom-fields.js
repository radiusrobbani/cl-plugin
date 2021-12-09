(function ($) {
    'use strict';
    const __ = function (text) {
        return text;
    }
    const Conditions = function () {
        this.storage = [
            {
                type: 'hasValue',
                operator: '!=empty',
                label: __('Has any value'),
                fieldTypes: ['text', 'textarea', 'number', 'url', 'checkbox', 'radio', 'date', 'select'],
                choices: function (field) {
                    return '<input type="text" disabled="" />';
                }
            },
            {
                type: 'hasNoValue',
                operator: '==empty',
                fieldTypes: ['text', 'textarea', 'number', 'url', 'checkbox', 'radio', 'date', 'select'],
                label: __('Has no value'),
                choices: function (field) {
                    return '<input type="text" disabled="" />';
                }
            },
            {
                type: 'contains',
                operator: '==contains',
                label: __('Value contains'),
                fieldTypes: ['text', 'textarea', 'number', 'url', 'select'],
                choices: function (fieldObject) {
                    return '<input type="text" />';
                }
            },
            {
                type: 'equalTo',
                operator: '==',
                label: __('Value is equal to'),
                fieldTypes: ['text', 'textarea', 'number', 'url'],
                choices: function (fieldObject) {
                    return '<input type="text" />';
                }
            },
            {
                type: 'notEqualTo',
                operator: '!=',
                fieldTypes: ['text', 'textarea', 'number', 'url'],
                label: __('Value is not equal to'),
                choices: function (fieldObject) {
                    return '<input type="text" />';
                }
            },
            {
                type: 'patternMatch',
                operator: '==pattern',
                label: __('Value matches pattern'),
                fieldTypes: ['text', 'textarea', 'url'],
                choices: function (fieldObject) {
                    return '<input type="text" placeholder="[a-z0-9]" />';
                }
            },
            {
                type: 'selectEqualTo',
                operator: '==',
                label: __('Value is equal to'),
                fieldTypes: ['select', 'checkbox', 'radio'],
                choices: function (field) {
                    return field.options;
                },
            },
            {
                type: 'selectNotEqualTo',
                operator: '!=',
                label: __('Value is not equal to')
            },
            {
                type: 'greaterThan',
                operator: '>',
                label: __('Value is greater than'),
                fieldTypes: ['number'],
                choices: function (fieldObject) {
                    return '<input type="number" />';
                }
            },
            {
                type: 'lessThan',
                operator: '<',
                label: __('Value is less than'),
                fieldTypes: ['number'],
                choices: function (fieldObject) {
                    return '<input type="number" />';
                }
            },
            {
                type: 'selectionGreaterThan',
                operator: '>',
                label: __('Selection is greater than'),
                fieldTypes: ['checkbox', 'select'],
                choices: function (fieldObject) {
                    return '<input type="number" />';
                }
            },
            {
                type: 'selectionLessThan',
                operator: '<',
                label: __('Selection is less than'),
                fieldTypes: ['checkbox', 'select'],
                choices: function (fieldObject) {
                    return '<input type="number" />';
                }
            }
        ]
    }
    const Model = function () {
        this.data = $.extend(true, {}, this.data);
    };
    Model.prototype = {
        id: '',
        $el: null,
        data: {},
        busy: false,
        changed: false,
        events: {},
        actions: {},
        filters: {},
        eventScope: '',
        wait: false,
        priority: 10,
        extend: function (args) {
            const model = $.extend({}, this, args);
            $.each(model.events, function (name, callback) {
                model._add_event(name, callback);
            });
            setTimeout(function () {
                model.initialize();
            }, 10)
            return model;
        },

        $: function (selector) {
            return this.$el.find(selector);
        },
        get: function (name, value) {
            value = value || null;
            if (typeof this[name] !== 'undefined') {
                value = this[name];
            }
            return value;
        },

        set: function (name, value) {
            this[name] = value;
            if (typeof this['_set_' + name] === 'function') {
                this['_set_' + name].apply(this);
            }
            return this;
        },

        _add_event: function (name, callback) {
            const
                model = this,
                event = name.substr(0, name.indexOf(' ')),
                selector = name.substr(name.indexOf(' ') + 1),
                context = model.field.context_id;
            $(document).on(event, context + ' ' + selector, function (e) {
                model[callback].apply(model, [e]);
            });
        },
    };
    const CFConditionalModel = {
        name: 'conditional_logic',
        events: {
            'change .conditions-toggle': 'onChangeToggle',
            'click .add-conditional-group': 'onClickAddGroup',
            'focus .condition-rule-field': 'onFocusField',
            'change .condition-rule-field': 'onChangeField',
            'change .condition-rule-operator': 'onChangeOperator',
            'click .add-conditional-rule': 'onClickAdd',
            'click .remove-conditional-rule': 'onClickRemove'
        },

        $rule: false,

        scope: function ($rule) {
            this.$rule = $rule;
            return this;
        },

        initialize: function () {
            this.render();
        },

        ruleData: function (name, value) {
            return this.$rule.data.apply(this.$rule, arguments);
        },

        $input: function (name) {
            return this.$rule.find('.condition-rule-' + name);
        },

        $td: function (name) {
            return this.$rule.find('td.' + name);
        },

        $hiddenField: function () {
            return $('<input type="hidden" data-disable="' + this.name + '" name="rtcl[fields][' + this.field.id + '][_' + this.name + ']" value="0" />');
        },

        $toggle: function () {
            return this.$('.conditions-toggle');
        },

        $control: function () {
            return this.$('.rule-groups');
        },

        $groups: function () {
            return this.$('.rule-group');
        },

        $rules: function () {
            return this.$('.rule');
        },

        open: function () {
            const $div = this.$control();
            $div.find('[name]').each(function () {
                $(this).prop('disabled', false);
            });
            $div.find('input[data-disable="conditional_logic"]').remove();
            $div.show();
        },

        close: function () {
            const $div = this.$control();
            $div.find('[name]').each(function () {
                $(this).prop('disabled', true);
            });
            if (!$div.find('input[data-disable="conditional_logic"]').length) {
                $div.append(this.$hiddenField());
            }
            $div.hide();
        },

        render: function () {
            // show
            if (this.$toggle().prop('checked')) {
                this.renderRules();
                this.open();
                // hide
            } else {
                this.close();
            }
        },

        renderRules: function () {

            // vars
            const self = this;

            // loop
            this.$rules().each(function () {
                self.renderRule($(this));
            });
        },

        renderRule: function ($rule) {
            this.scope($rule);
            this.renderField();
            this.renderOperator();
            this.renderValue();
        },

        renderField: function () {

            // vars
            const choices = [];
            const cid = this.field.id;
            const $select = this.$input('field');
            const fieldObjects = rtclCf.getFieldObjects();
            // loop
            fieldObjects.map(function (field) {

                // vars
                const choice = {
                    id: field.id,
                    text: field.label
                };

                // bail early if is self
                if (field.id === cid) {
                    choice.text += '(this field)';
                    choice.disabled = true;
                }
                // append
                choices.push(choice);
            });

            // allow for scenario where only one field exists
            if (!choices.length) {
                choices.push({
                    id: '',
                    text: 'No toggle fields available',
                });
            }

            // render
            rtclCf.renderSelect($select, choices);

            // set
            this.ruleData('field', $select.val());
        },

        renderOperator: function () {

            // bail early if no field selected
            if (!this.ruleData('field')) {
                return;
            }

            // vars
            const $select = this.$input('operator');
            const val = $select.val();
            const choices = [];

            // set saved value on first render
            // - this allows the 2nd render to correctly select an option
            if ($select.val() === null) {
                rtclCf.renderSelect($select, [{
                    id: this.ruleData('operator'),
                    text: ''
                }]);
            }

            // get selected field conditions
            const conditionTypes = rtclCf.getConditionTypes(this.ruleData('field'));

            // html
            conditionTypes.map(function (condition) {
                choices.push({
                    id: condition.operator,
                    text: condition.label
                });
            });

            // render
            rtclCf.renderSelect($select, choices);

            // set
            this.ruleData('operator', $select.val());
        },

        renderValue: function () {
            // bail early if no field selected
            if (!this.ruleData('field') || !this.ruleData('operator')) {
                return;
            }

            // vars
            const $select = this.$input('value');
            const $td = this.$td('value');
            const val = $select.val();

            // get selected field conditions
            const field = rtclCf.getFieldObjects(this.ruleData('field'));
            const conditionTypes = rtclCf.getConditionTypes(this.ruleData('field'), this.ruleData('operator'));
            // html
            const conditionType = conditionTypes ? conditionTypes[0] : null;
            const choices = conditionType ? conditionType.choices(field) : null;
            // create html: array
            let $newSelect = '';
            if (choices instanceof Array) {
                $newSelect = $('<select></select>');
                rtclCf.renderSelect($newSelect, choices);
                // create html: string (<input />)
            } else {
                $newSelect = $(choices);
            }

            // append
            $select.detach();
            $td.html($newSelect);

            // copy attrs
            // timeout needed to avoid browser bug where "disabled" attribute is not applied
            setTimeout(function () {
                ['class', 'name', 'id'].map(function (attr) {
                    $newSelect.attr(attr, $select.attr(attr));
                });
            }, 0);

            // select existing value (if not a disabled input)
            if (!$newSelect.prop('disabled')) {
                rtclCf.val($newSelect, val, true);
            }

            // set
            this.ruleData('value', $newSelect.val());
        },

        onChangeToggle: function () {
            this.render();
        },

        onClickAddGroup: function (e, $el) {
            e.preventDefault();
            this.addGroup();
        },

        addGroup: function () {

            // vars
            const $group = this.$('.rule-group:last');

            // duplicate
            const $group2 = rtclCf.duplicate($group);

            // update h4
            $group2.find('h4').text(rtclCf.__('or'));

            // remove all tr's except the first one
            $group2.find('tr').not(':first').remove();

            $group2.insertAfter($group);
        },

        onFocusField: function (e, $el) {
            this.renderField();
        },

        onChangeField: function (e) {

            const $el = $(e.target);
            this.scope($el.closest('.rule'));

            // set data
            this.ruleData('field', $el.val());

            // render
            this.renderOperator();
            this.renderValue();
        },

        onChangeOperator: function (e) {
            const $el = $(e.target);
            // scope
            this.scope($el.closest('.rule'));

            // set data
            this.ruleData('operator', $el.val());
            // render
            this.renderValue();
        },

        onClickAdd: function (e) {
            e.preventDefault();
            const $el = $(e.target);
            const $rule = $el.closest('.rule');
            // duplicate
            const $rule2 = rtclCf.duplicate($rule);

            $rule2.insertAfter($rule);

            // render
            this.renderRule($rule);
        },

        onClickRemove: function (e) {
            e.preventDefault();
            const $el = $(e.target);
            // vars
            const $rule = $el.closest('.rule');

            // save field
            // this.fieldObject.save();

            // remove group
            if ($rule.siblings('.rule').length === 0) {
                $rule.closest('.rule-group').remove();
            }

            // remove
            $rule.remove();
        }
    };

    const RtclCf = function () {
        this.$field_group = $('#rtcl-cfg');
        this.uniqidSeed = null;
        this.fields = {};
        this.models = {};
        this.tempModels = {};
        this.conditions = [];
        this.init();
    };
    RtclCf.prototype = {
        __: function (text) {
            return text;
        },
        init: function () {
            const cf = this;
            this.conditions = (new Conditions()).storage;
            this.models[CFConditionalModel.name] = CFConditionalModel;
            this.generateFieldData();
            $.each(this.fields, function (field_id, field) {
                $.each(field, function (field_item_key, field_item_value) {
                    const item_model = cf.models[field_item_key];
                    if (item_model && Object.keys(item_model).length) {
                        const modal_extended = $.extend(item_model, {$el: field.$el, field: field});
                        const model = new Model();
                        cf.tempModels[field_item_key] = model.extend(modal_extended);
                    }
                });
            });
        },
        getFieldObjects: function (field_id) {
            if (field_id) {
                return this.fields[field_id];
            }
            // loop
            const fields = [];
            $.each(this.fields, function (field_id, field) {
                fields.push(field);
            });

            // return
            return fields;
        },
        getConditionTypes: function (field_id, operator) {
            if (field_id) {
                const field = this.fields[field_id] || null;
                if (field) {
                    return this.conditions.filter((item) => {
                        if (field.type && (!item.fieldTypes || item.fieldTypes.indexOf(field.type) === -1)) {
                            return false;
                        }
                        return !(operator && (!item.operator || operator !== item.operator));

                    });
                }
            }
            return this.conditions;
        },
        generateFieldData: function (field_id) {
            const cf = this;
            cf.fields = {};
            cf.$field_group.find('.rtcl-cf-postbox').each(function () {
                const $field = $(this);
                const field = {
                    $el: $field,
                    context_id: "#" + $field.attr("id"),
                    id: $field.data('id'),
                    type: $field.attr("id").replace('rtcl-custom-field-', '').split("-")[0]
                }
                if (field_id && field.id !== field_id) return;
                $field.find('.rtcl-cfg-field-group').each(function () {
                    const $field_item = $(this);
                    const field_item = $field_item.data('field_item');
                    if (field_item) {
                        if (['label', 'slug', 'description'].indexOf(field_item) !== -1) {
                            field[field_item] = $field_item.find('.widefat').val();
                            if (field_item === 'label' && !field[field_item]) {
                                field[field_item] = cf.__("Untitled");
                            }
                        } else if (['required', 'searchable', 'listable', 'conditional_logic'].indexOf(field_item) !== -1) {
                            field[field_item] = !!$field_item.find('input[type=radio]').val();
                        } else if (field_item === 'options') {
                            const options = [];
                            $field_item.find('table tbody tr').each(function () {
                                const tr = $(this);
                                const option = {
                                    text: tr.find('td.label input').val(),
                                    id: tr.find('td.value input').val()
                                }
                                options.push(option);
                            });
                            field[field_item] = options;
                        }
                    }
                });
                cf.fields[field.id] = field;
                $field.data('rtcl_cf', field);
            });
        },
        val: function ($input, value, silent) {

            // vars
            const prevValue = $input.val();

            // bail if no change
            if (value === prevValue) {
                return false
            }

            // update value
            $input.val(value);

            // prevent select elements displaying blank value if option doesn't exist
            if ($input.is('select') && $input.val() === null) {
                $input.val(prevValue);
                return false;
            }

            // update with trigger
            if (silent !== true) {
                $input.trigger('change');
            }

            // return
            return true;
        },
        _add_event: function (name, callback, model) {


            // vars
            const
                cf = this,
                event = name.substr(0, name.indexOf(' ')),
                selector = name.substr(name.indexOf(' ') + 1),
                context = model.field.context_id;
            $(document).on(event, context + ' ' + selector, function (e) {

                // append $el to event object
                e.$el = $(this);
                e.$field = e.$el.closest('.rtcl-cf-postbox');

                // focus
                model.set('$field', e.$field);

                // callback
                model[callback].apply(model, [e]);

            });
        },
        renderSelect: function ($select, choices) {

            // vars
            const value = $select.val();
            const values = [];

            // callback
            const crawl = function (items) {

                // vars
                let itemsHtml = '';

                // loop
                items.map(function (item) {

                    // vars
                    const text = item.text || item.label || '';
                    const id = item.id || item.value || '';

                    // append
                    values.push(id.toString());

                    //  optgroup
                    if (item.children) {
                        itemsHtml += '<optgroup label="' + rtclCf.escAttr(text) + '">' + crawl(item.children) + '</optgroup>';

                        // option
                    } else {
                        itemsHtml += '<option value="' + rtclCf.escAttr(id) + '"' + (item.disabled ? ' disabled="disabled"' : '') + '>' + rtclCf.strEscape(text) + '</option>';
                    }
                });

                // return
                return itemsHtml;
            };

            // update HTML
            $select.html(crawl(choices));

            // update value
            if (values.indexOf(value) > -1) {
                $select.val(value);
            }

            // return selected value
            return $select.val();
        },
        strEscape: function (string) {
            const htmlEscapes = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return ('' + string).replace(/[&<>"']/g, function (chr) {
                return htmlEscapes[chr];
            });
        },
        escAttr: function (string) {
            return this.strEscape(string)
        },
        escHtml: function (string) {
            return ('' + string).replace(/<script|<\/script/g, function (html) {
                return rtclCf.strEscape(html);
            });
        },
        duplicate: function (args) {

            // allow jQuery
            if (args instanceof jQuery) {
                args = {
                    target: args
                };
            }

            // defaults
            args = Object.assign({}, {
                target: false,
                search: '',
                replacer: function (name, value, search, replace) {
                    return value.replace(search, replace);
                }
            }, args);
            // Callback function for jQuery replacing.
            const withReplacer = function (name) {
                return function (i, value) {
                    return args.replacer(name, value, args.search, args.replace);
                }
            };
            // compatibility
            args.target = args.target || args.$el;

            // vars
            const $el = args.target;

            // search
            args.search = args.search || $el.attr('data-id');
            args.replace = args.replace || this.uniqid();
            const $el2 = $el.clone();
            $el2.attr('data-id', args.replace);
            $el2.find('[id*="' + args.search + '"]').attr('id', withReplacer('id'));
            $el2.find('[for*="' + args.search + '"]').attr('for', withReplacer('for'));
            $el2.find('[name*="' + args.search + '"]').attr('name', withReplacer('name'));
            // return
            return $el2;
        },
        uniqid: function (prefix, moreEntropy) {
            if (typeof prefix === 'undefined') {
                prefix = '';
            }

            let retId;
            const formatSeed = function (seed, reqWidth) {
                seed = parseInt(seed, 10).toString(16); // to hex str
                if (reqWidth < seed.length) { // so long we split
                    return seed.slice(seed.length - reqWidth);
                }
                if (reqWidth > seed.length) { // so short we pad
                    return Array(1 + (reqWidth - seed.length)).join('0') + seed;
                }
                return seed;
            };

            if (!this.uniqidSeed) { // init seed with big random int
                this.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
            }
            this.uniqidSeed++;

            retId = prefix; // start with prefix, add current milliseconds hex string
            retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
            retId += formatSeed(this.uniqidSeed, 5); // add seed hex string
            if (moreEntropy) {
                // for more entropy we add a float lower to 10
                retId += (Math.random() * 10).toFixed(8).toString();
            }

            return retId;
        }
    };

    const rtclCf = new RtclCf();
    if (window.rtclCf === undefined) {
        window.rtclCf = rtclCf;
    }
    $(function () {
        rtclFieldSortable();
        rtclBindAutoCreateSlugs();
        rtclRenderIconSelect2();
    });

    $(document)
        .on('click', '.rtcl-cf-add-new', function (e) {
            e.preventDefault();
            console.log('clicked');
            const it = $(this);
            const dialog = $('<div style="display:none;height:450px;" class="rtcl-choose-field">' + it.data('message-loading') + '</div>').appendTo('body');
            dialog.dialog({
                close: function (event, ui) {
                    dialog.remove();
                },
                closeText: false,
                modal: true,
                minWidth: 810,
                maxHeight: .9 * $(window).height(),
                title: it.data('dialog-title'),
                position: {my: "center top+50", at: "center top", of: window}
            });

            function add_field_to_fields_list(html) {
                $('#post-body-content #rtcl-cfg').append(html);
                const newField = $('#post-body-content #rtcl-cfg .postbox').last();

                $('html, body').animate({
                    scrollTop: newField.offset().top - 50
                }, 1000);

                dialog.dialog('close');

                rtclBindAutoCreateSlugs();
                rtclAddPostboxToggles();
                rtclRenderIconSelect2();
                newField.typesFieldOptionsSortable();
                newField.typesMarkExistingField();
                rtclFieldSortable();
            }

            dialog.load(ajaxurl, {action: 'rtcl_edit_field_choose'},
                function (responseText, textStatus, XMLHttpRequest) {
                    /**
                     * choose new field
                     */
                    $(dialog).on('click', 'span.rtcl-field-button-insert', function () {
                        const _it = $(this),
                            type = _it.data('type');
                        $.ajax({
                            url: ajaxurl,
                            method: "POST",
                            data: {
                                action: 'rtcl_edit_field_insert',
                                type: type,
                                id: parseInt($("#post_ID").val(), 10),
                                __rtcl_wpnonce: rtcl_cfg.__rtcl_wpnonce,
                            },
                            beforeSend: function () {
                                _it.rtclBlock();
                            },
                            success: function (data) {
                                _it.rtclUnblock();
                                if (!data.error) {
                                    add_field_to_fields_list(data.data);
                                    rtclCf.init();
                                } else {
                                    alert(data.msg);
                                }
                            },
                            error: function (jqXHR, exception) {
                                _it.rtclUnblock();
                                alert('Uncaught Error.\n' + jqXHR.responseText);
                            }
                        });
                    });
                }
            );
            return false;
        })
        .on('click', '.js-rtcl-field-remove', function () {
            if (confirm($(this).data('message-confirm'))) {
                const _it = $(this),
                    target = _it.closest('.postbox'),
                    id = parseInt(target.data('id'), 10);
                if (id) {
                    $.ajax({
                        url: ajaxurl,
                        method: "POST",
                        data: {
                            action: 'rtcl_edit_field_delete',
                            id: id,
                            __rtcl_wpnonce: rtcl_cfg.__rtcl_wpnonce,
                        },
                        beforeSend: function () {
                            target.rtclBlock();
                        },
                        success: function (data) {
                            target.rtclUnblock();
                            if (!data.error) {
                                target.slideUp(function () {
                                    $(this).remove();
                                    rtclCf.init();
                                });
                            } else {
                                alert(data.msg);
                            }
                        },
                        error: function (jqXHR, exception) {
                            target.rtclUnblock();
                            alert('Uncaught Error.\n' + jqXHR.responseText);
                        }
                    })
                } else {
                    alert('Field id not selected');
                }
            }
            return false;
        })
        .on('click', '.rtcl-cfg-field .rtcl-select-options-wrap .rtcl-add-new-option', function (e) {
            e.preventDefault();
            const _self = $(this),
                wrap = _self.parent('.rtcl-select-options-wrap'),
                target = $('table.rtcl-fields-field-value-options tbody', wrap),
                type = wrap.data('type') || 'select',
                name = _self.data('name'),
                item = $("<tr />"),
                id = Number(new Date()),
                count = $("tr", target).length + 1;
            let default_name = name + "[default]",
                default_type = 'radio';
            if (type === 'checkbox') {
                default_name = name + "[default][]";
                default_type = 'checkbox';
            }
            item.append("<td class='num'><span class='js-types-sort-button hndle dashicons dashicons-menu'></span></td>");
            item.append("<td class='label'><input type='text' name='" + name + "[choices][" + id + "][title]' value='Option title " + count + "' ></td>");
            item.append("<td class='value'><input type='text' name='" + name + "[choices][" + id + "][value]' value='option-title-" + count + "' ></td>");
            item.append("<td><input type='" + default_type + "' name='" + default_name + "' value='" + id + "' ></td>");
            item.append("<td class='num'><span class='rtcl-delete-option dashicons dashicons-trash'></span></td>");
            target.append(item);
            target.typesFieldOptionsSortable();
            return false;
        })
        .on('click', '.rtcl-cfg-field .rtcl-select-options-wrap .rtcl-delete-option', function (e) {
            e.preventDefault();
            if (confirm("Are you sure?")) {
                $(this).parents('tr').remove();
            }
            return false;
        })
        .on('change', '.is_pro .rtcl-switch-toggle', function (e) {
            e.preventDefault();
            alert("This is pro feature.");
            e.target.checked = false;
            return false;
        });

    function rtclBindAutoCreateSlugs() {
        $(document).on('blur focus click', '.js-rtcl-slugize', function () {
            let slug = $(this).val();
            if ('' === slug) {
                slug = jQuery('.js-rtcl-slugize-source', $(this).closest('.postbox')).val();
            }
            if ('' !== slug) {
                let validSlug = rtcl_slugize(slug);

                if (validSlug !== slug || $(this).val() === '') {
                    $(this).val(validSlug.substring(0, 200));
                }
            }
        });
    }

    function rtclRenderIconSelect2() {
        if ($.fn.select2) {
            $('.rtcl-select2').select2({
                dropdownAutoWidth: true,
                width: '100%'
            });
            $('.rtcl-select2-icon').select2({
                dropdownAutoWidth: true,
                width: '100%',
                templateSelection: iformat,
                templateResult: iformat,
                escapeMarkup: function (text) {
                    return text;
                }
            });

            function iformat(icon) {
                const originalOption = icon.element;
                return '<i class="rtcl-icon rtcl-icon-' + $(originalOption).data('icon') + '"></i> ' + icon.text;
            }
        }
    }

    function rtcl_slugize(val) {
        /**
         * not a string or empty - thank you
         */
        if ('string' != typeof val || '' === val) {
            return;
        }
        val = val.toLowerCase();
        val = val.replace(/[^a-z0-9A-Z_]+/g, '-');
        val = val.replace(/\-+/g, '-');
        val = val.replace(/^\-/g, '');
        val = val.replace(/\-$/g, '');
        return val;
    }

    function rtclFieldSortable() {
        $("#rtcl-cfg").sortable({
            cursor: 'ns-resize',
            axis: 'y',
            handle: 'h2.hndle',
            forcePlaceholderSize: true,
            tolerance: 'pointer',
            start: function (e, ui) {
                ui.placeholder.height(ui.item.height() + 23);
            }
        });
    }

    // Sort and Drag
    $.fn.typesFieldOptionsSortable = function () {
        $('.rtcl-fields-radio-sortable, .rtcl-fields-select-sortable, .rtcl-fields-checkboxes-sortable', this).sortable({
            cursor: 'ns-resize',
            axis: 'y',
            handle: '.js-types-sort-button',
            start: function (e, ui) {
                ui.placeholder.height(ui.item.height() - 2);
            }
        });

        $('.rtcl-fields-checkboxes-sortable', this).sortable({
            start: function (e, ui) {
                ui.placeholder.height(ui.item.height() + 13);
            }
        });
    };

    $.fn.typesMarkExistingField = function () {

        const slug = $('.rtcl-forms-field-slug', this);

        if (slug.length && slug.val() !== '')
            slug.attr('data-types-existing-field', slug.val());
    };

    function rtclAddPostboxToggles() {
        $('.postbox .hndle, .postbox .handlediv').unbind('click.postboxes');
        postboxes.add_postbox_toggles();
    }

    $('body')
        .on('keyup', '.rtcl-forms-set-legend', function () {
            let val = $(this).val();
            if (val) {
                val = val.replace(/</, '&lt;');
                val = val.replace(/>/, '&gt;');
                val = val.replace(/'/, '&#39;');
                val = val.replace(/"/, '&quot;');
            }
            $(this).parents('.postbox').find('.rtcl-legend-update').html(val);
        })
        .typesFieldOptionsSortable();

})(jQuery);

(function ($) {
    // on dialogopen
    $(document).on('dialogopen', '.ui-dialog', function (e, ui) {
        // normalize primary buttons
        $('button.button-primary, button.wpcf-ui-dialog-cancel')
            .blur()
            .addClass('button')
            .removeClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only');
    });

    // resize
    let resizeTimeout;
    $(window).on('resize scroll', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(dialogResize, 200);
    });

    function dialogResize() {
        $('.ui-dialog').each(function () {
            $(this).css({
                'maxWidth': '100%',
                'top': $(window).scrollTop() + 50 + 'px',
                'left': ($('body').innerWidth() - $(this).outerWidth()) / 2 + 'px'
            });
        });
    }
})(jQuery);

