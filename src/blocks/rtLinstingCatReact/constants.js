const { __ } = wp.i18n;
const { Dashicon } = wp.components;

export const NORMAL_HOVER = [
	{ label: "Normal", value: "normal" },
	{ label: "Hover", value: "hover" },
];

export const TEXT_ALIGN = [
	{ label: __(<Dashicon icon={"editor-alignleft"} />), value: "left" },
	{ label: __(<Dashicon icon={"editor-aligncenter"} />), value: "center" },
	{ label: __(<Dashicon icon={"editor-alignright"} />), value: "right" }
];

export const BORDER_STYLES = [
	{ label: __("Dashed"), value: "dashed" },
	{ label: __("Solid"), value: "solid" },
	{ label: __("Dotted"), value: "dotted" },
	{ label: __("Double"), value: "double" },
	{ label: __("Groove"), value: "groove" },
	{ label: __("Inset"), value: "inset" },
	{ label: __("Outset"), value: "outset" },
	{ label: __("Ridge"), value: "ridge" },
];

export const STYLE_OPTIONS = [
	{ value: '1', label: __('Style 1', 'classified-listing') },
	{ value: '2', label: __('Style 2', 'classified-listing') },
	{ value: '3', label: __('Style 3', 'classified-listing') },
];

export const COL_OPTIONS = [
	{ value: '1', label: __('1 Col', 'classified-listing') },
	{ value: '2', label: __('2 Col', 'classified-listing') },
	{ value: '3', label: __('3 Col', 'classified-listing') },
	{ value: '4', label: __('4 Col', 'classified-listing') },
	{ value: '5', label: __('5 Col', 'classified-listing') },
	{ value: '6', label: __('6 Col', 'classified-listing') },
];

export const ORDER_OPTIONS = [
	{ value: 'term_id', label: __('ID', 'classified-listing') },
	{ value: 'date', label: __('Date', 'classified-listing') },
	{ value: 'name', label: __('Title', 'classified-listing') },
	{ value: 'count', label: __('Count', 'classified-listing') },
	{ value: 'custom', label: __('Custom Order', 'classified-listing') },
];

export const SORT_OPTIONS = [
	{ value: 'asc', label: __('Ascending', 'classified-listing') },
	{ value: 'desc', label: __('Descending', 'classified-listing') },
];

export const ICON_OPTIONS = [
	{ value: 'image', label: __('Image', 'classified-listing') },
	{ value: 'icon', label: __('Icon', 'classified-listing') },
];

export const TEXT_TRANSFORM = [
	{ label: __("None"), value: "none" },
	{ label: __("Lowercase"), value: "lowercase" },
	{ label: __("Capitalize"), value: "capitalize" },
	{ label: __("Uppercase"), value: "uppercase" },
];

export const FONT_WEIGHTS = [
	{ label: __("Lighter"), value: "lighter" },
	{ label: __("Normal"), value: "normal" },
	{ label: __("Bold"), value: "bold" },
	{ label: __("Bolder"), value: "bolder" },
];

export const TEXT_DECORATION = [
	{ label: __("Initial"), value: "initial" },
	{ label: __("Overline"), value: "overline" },
	{ label: __("Line Through"), value: "line-through" },
	{ label: __("Underline"), value: "underline" },
	{ label: __("Underline Oveline"), value: "underline overline" },
];


