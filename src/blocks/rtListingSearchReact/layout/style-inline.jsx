import classnames from 'classnames';
import { ContainerWrap } from "../../../util/style-components";
import { BadgeContainer, ListingContainer, ListingItemContainer, PriceContainer } from '../components/styles/Container.styles';
import { Content, H3, UL } from '../components/styles/Elements.styles';
const { __ } = wp.i18n;
import {
	PanelBody,
	BaseControl,
	ButtonGroup,
	Button,
	SelectControl,
	RangeControl,
	Dropdown,
	TabPanel,
	ColorPalette,
	PanelRow,
	ToggleControl,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
const { useState, useEffect, useRef, Component, createRef } = wp.element;
//external dependencies
import axios from "axios";
import Qs from 'qs';

function StyleInline(props) {
	const {
		block_id,
		data,
	} = props;

	const [catList, setCatList] = useState([]);
	const [locationList, setLocationList] = useState([]);
	const [listingType, setListingType] = useState([]);

	useEffect(() => {
		let data = {
			action: 'rtcl_gb_categories',
			rtcl_nonce: rtcl_block_script.rtcl_nonce,
			portion: 'listing'
		}

		axios.post(rtcl_block_script.ajaxurl, Qs.stringify(data))
			.then((response) => {
				let catListings = [];
				let ai = 0;
				for (const [value, label] of Object.entries(response.data)) {
					catListings[ai] = { value, label };
					ai++;
				}
				setCatList([...catListings])
			})
			.catch((error) => console.log(error));
	}, []);

	useEffect(() => {
		let data = {
			action: 'rtcl_gb_location_ajax',
			rtcl_nonce: rtcl_block_script.rtcl_nonce,
		}

		axios.post(rtcl_block_script.ajaxurl, Qs.stringify(data))
			.then((response) => {
				let locationListings = [];
				let ai = 0;
				for (const [value, label] of Object.entries(response.data)) {
					locationListings[ai] = { value, label };
					ai++;
				}
				setLocationList([...locationListings])
			})
			.catch((error) => console.log(error));
	}, []);

	useEffect(() => {
		let data = {
			action: 'rtcl_gb_listing_type_ajax',
			rtcl_nonce: rtcl_block_script.rtcl_nonce,
		}

		axios.post(rtcl_block_script.ajaxurl, Qs.stringify(data))
			.then((response) => {
				let types = [];
				let ai = 0;
				for (const [value, label] of Object.entries(response.data)) {
					types[ai] = { value, label };
					ai++;
				}
				setListingType([...types])
			})
			.catch((error) => console.log(error));
	}, []);



	return [
		<div class="rtcl rtcl-search rtcl-widget-search rtcl-gutenberg-widget-search rtcl-search-inline">
			<form action="http://wptest.test/listings/" class="rtcl-widget-search-form rtcl-widget-search-inline active-4">
				<div class="row">
					<div class="form-group ws-item ws-location  col-md-4 col-sm-12 col-12">
						<label for="rtcl-search-category-691810693">Select a location</label>
						<div class="rtcl-geo-address-field">
							<input type="text" name="geo_address" autocomplete="off" value="" placeholder="Select a location" class="form-control rtcl-geo-address-input" />
							<i class="rtcl-get-location rtcl-icon rtcl-icon-target"></i>
							<input type="hidden" class="latitude" name="center_lat" value="" />
							<input type="hidden" class="longitude" name="center_lng" value="" />
						</div>
					</div>
					<div class="form-group ws-item ws-location  col-md-4 col-sm-12 col-12">
						<div class="rtcl-range-slider-field">
							<label class="rtcl-range-label">Radius (<span class="rtcl-range-value">0</span> Miles )
							</label>
							<input type="range" class="form-control-range rtcl-range-slider-input" name="distance" min="0" max="300" value="30" />
						</div>
					</div>
					<div class="form-group ws-item ws-category col-md-4 col-sm-6 col-12">
						<div class="custom-select-field">

							{/* <SelectControl
								label={__('Category', 'classified-listing')}
								options={catList}
								name="rtcl_category"
							/> */}

							<select name="rtcl_category" id="rtcl-category-search-691810693" class="form-control rtcl-category-search">
								<option value="" selected="selected">Select a category</option>
								<option class="level-0" value="acatone">acatone</option>
								<option class="level-1" value="acatcild">&nbsp;&nbsp;&nbsp;acatcild</option>
								<option class="level-0" value="apartments-flats">Apartments &amp; Flats</option>
								<option class="level-0" value="cameras-camcorders">Cameras &amp; Camcorders</option>
								<option class="level-0" value="childrens-items">Childrens Items</option>
								<option class="level-0" value="commercial-property">Commercial Property</option>
								<option class="level-0" value="computers-tablets">Computers &amp; Tablets</option>
								<option class="level-0" value="electricity-ac-bathroom">Electricity, AC &amp; Bathroom</option>
								<option class="level-0" value="electronics">Electronics</option>
								<option class="level-0" value="hobby-sport-kids">Hobby, Sport &amp; Kids</option>
								<option class="level-0" value="home-appliances">Home Appliances</option>
								<option class="level-0" value="home-appliances-home-appliances">Home Appliances</option>
								<option class="level-0" value="houses">Houses</option>
								<option class="level-0" value="industry-machinery-tools">Industry Machinery &amp; Tools</option>
								<option class="level-0" value="mobile-phone">Mobile Phone</option>
								<option class="level-0" value="others">Others</option>
								<option class="level-0" value="others-home-items">Others Home Items</option>
								<option class="level-0" value="sports-equipment">Sports Equipment</option>
							</select>
						</div>
					</div>
					<div class="form-group ws-item ws-type col-md-4 col-sm-6 col-12">
						<div class="custom-select-field">
							<select class="form-control" name="filters[ad_type]">
								<option value="">Select type</option>
								<option value="sell">Sell</option>
								<option value="buy">Buy</option>
								<option value="exchange">Exchange</option>
								<option value="job">Job</option>
								<option value="to_let">To-Let</option>
							</select>
						</div>
					</div>

					<div class="ws-item ws-price col-md-4 col-sm-6 col-xs-6 form-group">
						<input type="text" name="filters[price][min]" class="form-control " placeholder="min" />
					</div>
					<div class="ws-item ws-price col-md-4 col-sm-6 col-xs-6 form-group">
						<input type="text" name="filters[price][max]" class="form-control" placeholder="max" />
					</div>

					<div class="form-group ws-item ws-text col-md-4 col-sm-6">
						<div class="rt-autocomplete-wrapper">
							<input type="text" name="q" class="rtcl-autocomplete form-control ui-autocomplete-input" placeholder="Enter your keyword here ..." autocomplete="off" />
						</div>
					</div>

					<div class="form-group ws-item ws-button col-md-4 col-sm-6">
						<div class="rtcl-action-buttons text-right">
							<button name="eaddons-search" type="submit" class="btn btn-primary form-control">Search</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	]
}

export default StyleInline;
