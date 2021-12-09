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

export const VIEW_OPTIONS = [
	{ value: 'list', label: __('List View', 'classified-listing') },
	{ value: 'grid', label: __('Grid View', 'classified-listing') },
];

export const ORDER_OPTIONS = [
	{ value: 'date', label: __('Date (Recent comes first)', 'classified-listing') },
	{ value: 'title', label: __('Title', 'classified-listing') },
	{ value: 'ID', label: __('ID', 'classified-listing') },
	{ value: 'price', label: __('Price', 'classified-listing') },
	{ value: 'views', label: __('Views', 'classified-listing') },
	{ value: 'rand', label: __('Rand', 'classified-listing') },
	{ value: 'none', label: __('None', 'classified-listing') },
];


export const SORT_OPTIONS = [
	{ value: 'asc', label: __('Ascending', 'classified-listing') },
	{ value: 'desc', label: __('Descending', 'classified-listing') },
];

export const THUMB_POSITIONS = [
	{ value: 'top', label: __('Top', 'classified-listing') },
	{ value: 'left', label: __('Left', 'classified-listing') },
];

export const COLORS = [
	{ name: 'Black', color: '#000000' },
	{ name: 'Cyan bluish gray', color: '#abb8c3' },
	{ name: 'White', color: '#ffffff' },
	{ name: 'Pale pink', color: '#ffc0cb' },
	{ name: 'Vivid red', color: '#cf2e2e' },
	{ name: 'Luminous vivid orange', color: '#ff6900' },
	{ name: 'Luminous vivid amber', color: '#fcb900' },
	{ name: 'Light green cyan', color: '#7bdcb5' },
	{ name: 'Vivid green cyan', color: '#00d084' },
	{ name: 'Pale cyan blue', color: '#8ed1fc' },
	{ name: 'Vivid cyan blue', color: '#3593e3' },
	{ name: 'Vivid purple', color: '#9b51e0' },
];

export const COL_OPTIONS = [
	{ value: '1', label: __('1 Col', 'classified-listing') },
	{ value: '2', label: __('2 Col', 'classified-listing') },
	{ value: '3', label: __('3 Col', 'classified-listing') },
	{ value: '4', label: __('4 Col', 'classified-listing') },
	{ value: '5', label: __('5 Col', 'classified-listing') },
	{ value: '6', label: __('6 Col', 'classified-listing') },
];

export const STYLE_OPTIONS = [
	{ value: '1', label: __('Style 1', 'classified-listing') },
	{ value: '2', label: __('Style 2', 'classified-listing') },
	{ value: '3', label: __('Style 3', 'classified-listing') },
	{ value: '4', label: __('Style 4', 'classified-listing') },
	{ value: '5', label: __('Style 5', 'classified-listing') },
];
