import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import Edit from "./edit";
import example from "./example";

registerBlockType("rt-radius-blocks/listing-catreact", {
	title: __("Listing Category", "classified-listing"),
	description: __("clasified listing category box", "classified-listing"),
	category: "classified-list-gb",
	icon: 'category',
	keywords: [
		__("category", "classified-listing"),
		__("category-box", "classified-listing"),
		__("classified-listing", "classified-listing"),
	],
	//attributes,
	getEditWrapperProps({ align }) {
		if (
			'left' === align ||
			'right' === align ||
			'full' === align ||
			'wide' === align
		) {
			return { 'data-align': align };
		}
	},

	edit: Edit,
	save: () => null,
	example,
});