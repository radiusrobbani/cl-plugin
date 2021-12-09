import axios from "axios";
import Qs from "qs";
import RenderView from "./renderView";
import "./style.scss";
const { render, useState, useEffect } = wp.element;
const { Spinner } = wp.components;


function RtListingSearchReact(props) {

	return (
		<div className="rt-listing-search-react-frontend">
			<RenderView {...props} />
		</div>
	)

}


const divsToUpdate = document.querySelectorAll(".rt-listing-search-react")
divsToUpdate.forEach(div => {
	const data = JSON.parse(div.querySelector("pre").innerText)
	render(<RtListingSearchReact {...data} />, div)
	div.classList.remove("rt-radius-blocks-ph")
})
