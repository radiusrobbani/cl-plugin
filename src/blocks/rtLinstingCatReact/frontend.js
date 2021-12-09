import axios from "axios";
import Qs from "qs";
import RenderView from "./renderView";
import "./style.scss";
const { render, useState, useEffect } = wp.element;
const { Spinner } = wp.components;

function RtListingCatReact(props) {
	const [data, setData] = useState([]);
	const [dataSuccess, setDataSuccess] = useState(true);
	const [catSideQuery, setCatSideQuery] = useState(false);

	useEffect(() => {
		let ajaxdata = {
			action: 'rtcl_gb_listing_cat_box',
			rtcl_nonce: rtcl_block_script.rtcl_nonce,
			attributes: props
		}

		axios.post(rtcl_block_script.ajaxurl, Qs.stringify(ajaxdata))
			.then((response) => {
				if (response.data.success) {
					setData([...response.data.data]);
					setDataSuccess(response.data.success)
				} else {
					setData([]);
					setDataSuccess(response.data.success)
				}
			})
			.catch((error) => console.log(error));
	}, [catSideQuery]);

	//Check if the post
	const hasPosts = Array.isArray(data) && data.length;
	if (!hasPosts) {
		return (<div className="rtcl-gb-spinner"><Spinner /></div>);
	}

	return (
		<div className="rt-listing-catreact-frontend">
			<RenderView {...props} data={data} />
		</div>
	)

}

const divsToUpdate = document.querySelectorAll(".rt-listing-catreact")
divsToUpdate.forEach(div => {
	const attributes = JSON.parse(div.querySelector("pre").innerText)
	render(<RtListingCatReact {...attributes} />, div)
	div.classList.remove("rt-radius-blocks-ph")
})
