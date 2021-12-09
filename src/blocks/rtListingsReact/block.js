import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import example from "./example";

registerBlockType("rt-radius-blocks/listings", {
	title: __("Listings", "classified-listing"),
	description: __("classified listings", "classified-listing"),
	category: "classified-list-gb",
	icon: 'grid-view',
	keywords: [
		__("listings", "classified-listing"),
		__("listings-grid", "classified-listing"),
		__("classified-listing", "classified-listing"),
	],
	//attributes,
	getEditWrapperProps({ align }) {
		if ('left' === align ||
			'right' === align ||
			'full' === align ||
			'wide' === align
		) { return { 'data-align': align }; }
	},
	edit: Edit,
	save: () => null,
	example,
});