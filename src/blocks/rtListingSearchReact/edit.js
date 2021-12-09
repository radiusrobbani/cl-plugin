//wordpress dependencies
const { __ } = wp.i18n;
const { useState, useEffect, useRef, Component, createRef } = wp.element;
const {
	RichText,
	BlockControls,
	useBlockProps,
	BlockAlignmentToolbar
} = wp.blockEditor;
const { select } = wp.data;
import { Spinner } from "@wordpress/components";
import axios from "axios";
import Qs from "qs";
import "./editor.scss";
import "./style.scss";
import Inspector from "./inspector";
import RenderView from "./renderView";
import $ from 'jquery';


function Edit(props) {
	const { isSelected, attributes, setAttributes, clientId } = props;
	setAttributes({ block_id: clientId });
	const { align } = attributes;

	//render
	return [
		<BlockControls key="controls">
			<BlockAlignmentToolbar
				value={align}
				onChange={(newaAlign) => setAttributes({ align: newaAlign })}
				controls={['left', 'right', 'center', 'wide', 'full']}
			/>
		</BlockControls>,

		isSelected && (
			<Inspector
				attributes={attributes}
				setAttributes={setAttributes}
			/>
		),

		<div className="rt-listing-search-react-editor">
			<RenderView {...attributes} />
		</div>
	]
}

export default Edit;