import classnames from 'classnames';
import { ContainerWrap } from "../../../util/style-components";
import { BadgeContainer, ListingContainer, ListingItemContainer, PriceContainer } from '../components/styles/Container.styles';
import { Content, H3, UL } from '../components/styles/Elements.styles';
const { __ } = wp.i18n;

function StyleGrid(props) {

	const {
		block_id,
		data,
	} = props;

	return [

		<div class="rtcl rtcl-search rtcl-gutenberg-widget-search rtcl-search-vertical">
			<form action="http://wptest.test/listings/" class="rtcl-widget-search-vertical rtcl-widget-search-form">
				<div class="form-group ws-item ws-location ">
					<label for="rtcl-search-category-1881690710">Select a location</label>
					<div class="rtcl-geo-address-field">
						<input type="text" name="geo_address" autocomplete="off" placeholder="Select a location" class="form-control rtcl-geo-address-input" />
						<i class="rtcl-get-location rtcl-icon rtcl-icon-target"></i>
						<input type="hidden" class="latitude" name="center_lat" />
						<input type="hidden" class="longitude" name="center_lng" />
					</div>
				</div>
				<div class="form-group ws-item ws-location ">
					<div class="rtcl-range-slider-field">
						<label class="rtcl-range-label">Radius (<span class="rtcl-range-value">0</span> Miles )
						</label>
						<input type="range" class="form-control-range rtcl-range-slider-input" name="distance" min="0" max="300" />
					</div>
				</div>

				<div class="form-group">
					<label>Select a category</label>
					<div class="custom-select-field">
						<div class="rtcl-terms">
							<input type="hidden" class="rtcl-term-hidden rtcl-term-rtcl_category" data-slug="" />
							<input type="hidden" name="rtcl_category" class="rtcl-term-hidden-value rtcl-term-rtcl_category" />
							<select class="form-control rtcl-category-search" data-taxonomy="rtcl_category" data-parent="0">
								<option value="-1">-- Select a category --</option>
								<option data-slug="acatone" value="35">acatone</option>
								<option data-slug="apartments-flats" value="28">Apartments &amp; Flats</option>
								<option data-slug="cameras-camcorders" value="5">Cameras &amp; Camcorders</option>
								<option data-slug="childrens-items" value="13">Children's Items</option>
								<option data-slug="commercial-property" value="31">Commercial Property</option>
								<option data-slug="computers-tablets" value="22">Computers &amp; Tablets</option>
								<option data-slug="electricity-ac-bathroom" value="4">Electricity, AC &amp; Bathroom</option>
								<option data-slug="electronics" value="6">Electronics</option>
								<option data-slug="hobby-sport-kids" value="14">Hobby, Sport &amp; Kids</option>
								<option data-slug="home-appliances" value="9">Home Appliances</option>
								<option data-slug="home-appliances-home-appliances" value="10">Home Appliances</option>
								<option data-slug="houses" value="30">Houses</option>
								<option data-slug="industry-machinery-tools" value="32">Industry Machinery &amp; Tools</option>
								<option data-slug="mobile-phone" value="34">Mobile Phone</option>
								<option data-slug="others" value="24">Others</option>
								<option data-slug="others-home-items" value="17">Others Home Items</option>
								<option data-slug="sports-equipment" value="20">Sports Equipment</option>
							</select>
						</div>
					</div>
				</div>


				<div class="form-group">
					<label>Select Type</label>
					<div class="custom-select-field">
						<select class="form-control" name="filters[ad_type]">
							<option>Select type</option>
							<option value="sell">Sell</option>
							<option value="buy">Buy</option>
							<option value="exchange">Exchange</option>
							<option value="job">Job</option>
							<option value="to_let">To-Let</option>
						</select>
					</div>
				</div>

				<div class="form-group-price">
					<label>Price Range</label>
					<div class="row">
						<div class="col-md-6 col-xs-6">
							<div class="form-group">
								<input type="text" name="filters[price][min]" class="form-control" placeholder="min" />
							</div>
						</div>
						<div class="col-md-6 col-xs-6">
							<div class="form-group">
								<input type="text" name="filters[price][max]" class="form-control" placeholder="max" />
							</div>
						</div>
					</div>
				</div>
				<div class="form-group">
					<label>keyword here</label>
					<input type="text" name="q" class="rtcl-autocomplete form-control ui-autocomplete-input" placeholder="Enter your keyword here ..." autocomplete="off"></input>
				</div>
				<div class="form-group">
					<div class="d-block button-section">
						<button name="eaddons-search" type="submit" class="my-3 btn btn-primary form-control">Search Listings</button>
						{/* <a href="http://wptest.test/elementor-2214/" class="btn btn-danger my-3 form-control">Reset</a> */}
					</div>
				</div>
			</form>
		</div>

	]
}

export default StyleGrid;
