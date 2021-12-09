//wordpress dependencies
import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
//internal dependencies
import Edit from "./edit";
import example from "./example";

registerBlockType("rt-radius-blocks/search-form", {
	title: __("Listign Search Form", "classified-listing"),
	description: __("classified listings search form", "classified-listing"),
	category: "classified-list-gb",
	icon: 'grid-view',
	keywords: [
		__("listings", "classified-listing"),
		__("listing search", "classified-listing"),
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