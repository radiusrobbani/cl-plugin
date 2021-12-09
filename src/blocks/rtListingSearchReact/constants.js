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

export const STYLE_OPTIONS = [
	{ value: '1', label: __('Inline', 'classified-listing') },
	{ value: '2', label: __('Vartical', 'classified-listing') },
];
