import axios from "axios";
import Qs from "qs";
import RenderView from "./renderView";
import "./style.scss";
const { render, useState, useEffect } = wp.element;
const { Spinner } = wp.components;
import $ from 'jquery';

function RtListingsReact(props) {
	const { perPage, content_visibility } = props;
	const [listingsEffect, setListingsEffect] = useState(false);

	const [data, setData] = useState([]);
	const [dataSuccess, setDataSuccess] = useState(true);
	const [pageState, setPageState] = useState(0);
	const [pageIndex, setPageIndex] = useState(1);

	useEffect(() => {

		$(document).on('click', '.pagination .pagination_number', function () {
			setPageIndex(parseInt($(this).attr('data-value')));
			$('.pagination .pagination_number').removeClass('active');
			$(this).addClass('active');
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
			attributes: props,
			offset: newOffset,
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


	return (
		<div className="rt-listings-react-frontend">
			<RenderView {...props} data={data} />
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
	)

}


const divsToUpdate = document.querySelectorAll(".rt-listings-react")
divsToUpdate.forEach(div => {
	const data = JSON.parse(div.querySelector("pre").innerText)
	render(<RtListingsReact {...data} />, div)
	div.classList.remove("rt-radius-blocks-ph")
})
