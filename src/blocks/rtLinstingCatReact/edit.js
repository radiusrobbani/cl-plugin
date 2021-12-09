//wordpress dependencies
const { __ } = wp.i18n;
const { useState, useEffect, Component, createRef } = wp.element;
const {
	RichText,
	BlockControls,
	useBlockProps,
	BlockAlignmentToolbar

} = wp.blockEditor;
const { Spinner } = wp.components;

import axios from "axios";
import Qs from "qs";
import "./editor.scss";
import "./style.scss";
import Inspector from "./inspector";
import RenderView from "./renderView";

function Edit(props) {

	const { isSelected, attributes, setAttributes, clientId } = props;
	const { align, client_id } = attributes;
	setAttributes({ client_id: clientId });

	const [catListBox, setCatListBox] = useState([]);
	const [dataSuccess, setDataSuccess] = useState(true);
	const [catSideQuery, setCatSideQuery] = useState(false);

	const catSideQueryChange = () => {
		setCatSideQuery(!catSideQuery);
	}

	useEffect(() => {
		let data = {
			action: 'rtcl_gb_listing_cat_box',
			rtcl_nonce: rtcl_block_script.rtcl_nonce,
			attributes: attributes
		}

		axios.post(rtcl_block_script.ajaxurl, Qs.stringify(data))
			.then((response) => {
				if (response.data.success) {
					setCatListBox([...response.data.data]);
					setDataSuccess(response.data.success)
				} else {
					setCatListBox([]);
					setDataSuccess(response.data.success)
				}
			})
			.catch((error) => console.log(error));

	}, [catSideQuery]);

	// Check if the post
	const hasPosts = Array.isArray(catListBox) && catListBox.length;
	if (!hasPosts) {
		return [
			isSelected && (
				<Inspector
					attributes={attributes}
					setAttributes={setAttributes}
					catSideQueryChange={catSideQueryChange}
				/>
			),
			dataSuccess ? (<div className="rtcl-gb-spinner"><Spinner /></div>) : (
				__('No posts found.', 'classified-listing')
			)
		];
	}

	return [
		<BlockControls key="controls">
			<BlockAlignmentToolbar
				value={align}
				onChange={(newaAlign) => setAttributes({ align: newaAlign })}
				controls={['center', 'wide', 'full']}
			/>
		</BlockControls>,
		isSelected && (
			<Inspector
				attributes={attributes}
				setAttributes={setAttributes}
				catSideQueryChange={catSideQueryChange}
			/>
		),
		<div className="rt-listing-catreact-editor">
			<RenderView {...attributes} data={catListBox} />
		</div>
	]
}

export default Edit;