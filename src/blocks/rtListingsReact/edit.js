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
	const { align, perPage, content_visibility } = attributes;
	const isOffset = useRef(false);

	const [listingsEffect, setListingsEffect] = useState(false);
	const listingsSideEffectChange = () => {
		setListingsEffect(!listingsEffect);
		isOffset.current = true;
	}

	const [data, setData] = useState([]);
	const [dataSuccess, setDataSuccess] = useState(true);
	const [pageState, setPageState] = useState(0);
	const [pageIndex, setPageIndex] = useState(1);

	useEffect(() => {

		$(document).on('click', '.pagination .pagination_number', function () {
			setPageIndex(parseInt($(this).attr('data-value')));
			$('.pagination .pagination_number').removeClass('active');
			$(this).addClass('active');
			isOffset.current = false;
		})

		let newOffset = 0;
		let newLimit = 0;
		let paginationLimit = 0;

		newLimit = perPage;
		newOffset = (pageIndex * newLimit) - newLimit;
		paginationLimit = newLimit;

		let ajaxdata = {
			action: 'rtcl_gb_listings_ajax',
			rtcl_nonce: rtcl_block_script.rtcl_nonce,
			attributes: attributes,
			offset: isOffset.current ? 0 : newOffset,
		}

		axios.post(rtcl_block_script.ajaxurl, Qs.stringify(ajaxdata))
			.then((response) => {
				if (response.data.success) {
					setData([...response.data.data.posts]);
					setDataSuccess(response.data.success)
				} else {
					setData([]);
					setDataSuccess(response.data.success)
				}
				setPageState(Math.ceil(response.data.data.total_post / ((paginationLimit == 0) || (paginationLimit == -1) ? 1 : paginationLimit)))
			})
			.catch((error) => console.log(error));

	}, [listingsEffect, pageIndex]);


	//Check if the post
	const hasPosts = Array.isArray(data) && data.length;
	if (!hasPosts) {
		return [
			isSelected && (
				<Inspector
					attributes={attributes}
					setAttributes={setAttributes}
					listingsSideEffectChange={listingsSideEffectChange}
				/>
			),
			dataSuccess ? (<div className="rtcl-gb-spinner"><Spinner /></div>) : (
				__('No posts found.', 'classified-listing')
			)
		];
	}

	//phone call click
	$(function () {
		$('.rtcl-gb-phone-reveal').on('click', function () {
			if ($(this).hasClass('not-revealed')) {
				$(this).removeClass('not-revealed').addClass('revealed');
				var phone = $(this).data('phone');
				$(this).find('span').text(phone);
			}
			return false;
		});
	});


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
				listingsSideEffectChange={listingsSideEffectChange}
			/>
		),

		<div className="rt-listings-react-editor">
			<RenderView {...attributes} data={data} />
			{content_visibility["pagination"] ?
				<div className={"pagination"}>
					{pageState ? (Array.from(Array(pageState), (e, i) => {
						if (i == 0) {
							return <span className={"pagination_number active"} data-value={i + 1} key={i}>{i + 1}</span>
						} else {
							return <span className={"pagination_number"} data-value={i + 1} key={i}>{i + 1}</span>
						}
					})) : ''}
				</div>
				: ""}
		</div>
	]
}

export default Edit;