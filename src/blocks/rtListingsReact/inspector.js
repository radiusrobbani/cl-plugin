//wordpress dependencies
const { __ } = wp.i18n;
const { InspectorControls, PanelColorSettings, MediaUpload } = wp.blockEditor;

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

const { useEffect, useState } = wp.element;
const { select } = wp.data;

//internal dependencies
import Select from 'react-select';
import ColorControl from "../../util/color-control";
import DimensionsControl from "../../util/dimensions-control";
import UnitControlCustom from "../../util/unit-control";
import {
	NORMAL_HOVER,
	TEXT_ALIGN,
	FONT_WEIGHTS,
	TEXT_TRANSFORM,
	STYLE_OPTIONS,
	ORDER_OPTIONS,
	SORT_OPTIONS,
	COLORS,
	COL_OPTIONS,
	THUMB_POSITIONS,
	VIEW_OPTIONS,
} from "./constants";

//external dependencies
import axios from "axios";
import Qs from 'qs';

function Inspector(props) {
	const { attributes, setAttributes, listingsSideEffectChange } = props;
	const {
		cats,
		locations,
		listing_type,
		promotion_in,
		promotion_not_in,
		orderby,
		sortby,
		perPage,
		col_padding,
		content_padding,
		col_style,
		title_style,
		meta_style,
		content_style,
		content_margin,
		price_style,
		price_margin,
		price_padding,
		button_style,
		container_margin,
		container_padding,
		container_style,
		content_visibility,
		content_limit,
		col_desktop,
		col_mobile,
		col_tablet,
		badge_style,
		sold_style,
		promotion_style

	} = attributes;

	const FONT_SIZE_MAX = title_style["fsUnit"] === "em" ? 10 : 100;
	const FONT_SIZE_STEP = title_style["fsUnit"] === "em" ? 0.1 : 1;

	const GUTTER_SPACE_MAX = col_style["gsUnit"] === "em" ? 10 : 100;
	const GUTTER_SPACE_STEP = col_style["gsUnit"] === "em" ? 0.1 : 1;

	const SPACING_MAX = title_style["lsUnit"] === "em" ? 10 : 100;
	const SPACING_STEP = title_style["lsUnit"] === "em" ? 0.1 : 1;

	const LINE_HEIGHT_MAX = title_style["lhUnit"] === "em" ? 10 : 100;
	const LINE_HEIGHT_STEP = title_style["lhUnit"] === "em" ? 0.1 : 1;

	const [catList, setCatList] = useState([]);
	const [locationList, setLocationList] = useState([]);
	const [listingType, setListingType] = useState([]);
	const [promotionType, setPromotionType] = useState([]);

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

	useEffect(() => {
		let data = {
			action: 'rtcl_gb_listing_promotion_ajax',
			rtcl_nonce: rtcl_block_script.rtcl_nonce,
		}

		axios.post(rtcl_block_script.ajaxurl, Qs.stringify(data))
			.then((response) => {
				let propotions = [];
				let ai = 0;
				for (const [value, label] of Object.entries(response.data)) {
					propotions[ai] = { value, label };
					ai++;
				}
				setPromotionType([...propotions])
			})
			.catch((error) => console.log(error));
	}, []);

	return (
		<InspectorControls key="controls">
			<div className="rtcl-gb-panel-control">
				<TabPanel
					className="rtcl-gb-parent-tab-panel"
					activeClass="active-tab"
					tabs={[
						{
							name: "general",
							title: "General",
							className: "rtcl-gb-tab general",
						},
						{
							name: "styles",
							title: "Styles",
							className: "rtcl-gb-tab styles",
						},
						{
							name: "advance",
							title: "Advance",
							className: "rtcl-gb-tab advance",
						},
					]}
				>
					{(tab) => (
						<div className={"rtcl-gb-tab-controls" + tab.name}>

							{tab.name === "general" && (
								<>
									<PanelBody>
										<SelectControl
											label={__('View', 'classified-listing')}
											options={VIEW_OPTIONS}
											value={col_style["style"]}
											onChange={(style) => setAttributes({
												col_style: { ...col_style, style }
											})}
										/>

										{col_style["style"] === "list" && (<SelectControl
											label={__('Style', 'classified-listing')}
											options={STYLE_OPTIONS}
											value={col_style["style_list"]}
											onChange={(style_list) => setAttributes({
												col_style: { ...col_style, style_list }
											})}
										/>)}

										{col_style["style"] === "grid" && (<SelectControl
											label={__('Style', 'classified-listing')}
											options={STYLE_OPTIONS}
											value={col_style["style_grid"]}
											onChange={(style_grid) => setAttributes({
												col_style: { ...col_style, style_grid }
											})}
										/>)}

										<div className="components-base-control__field">
											<label className="components-base-control__label" htmlFor="react-select-2-input">{__('Promotions', 'classified-listing')}</label>
											<Select
												options={promotionType}
												value={promotion_in}
												onChange={(value) => {
													setAttributes({ promotion_in: value }),
														listingsSideEffectChange()
												}}
												isMulti={true}
												closeMenuOnSelect={false}
											/>
										</div>

										<div className="components-base-control__field">
											<label className="components-base-control__label" htmlFor="react-select-2-input">{__('Promotions Excludes', 'classified-listing')}</label>
											<Select
												options={promotionType}
												value={promotion_not_in}
												onChange={(value) => {
													setAttributes({ promotion_not_in: value }),
														listingsSideEffectChange()
												}}
												isMulti={true}
												closeMenuOnSelect={false}
											/>
										</div>

										<SelectControl
											label={__('Listing Type', 'classified-listing')}
											options={listingType}
											value={listing_type}
											onChange={(value) => {
												setAttributes({ listing_type: value }),
													listingsSideEffectChange()
											}}
										/>

										<div className="components-base-control__field">
											<label className="components-base-control__label" htmlFor="react-select-2-input">{__('Categories', 'classified-listing')}</label>
											<Select
												options={catList}
												value={cats}
												onChange={(value) => {
													setAttributes({ cats: value }),
														listingsSideEffectChange()
												}}
												isMulti={true}
												closeMenuOnSelect={false}
											/>
										</div>

										<div className="components-base-control__field">
											<label className="components-base-control__label" htmlFor="react-select-2-input">{__('Locations', 'classified-listing')}</label>
											<Select
												options={locationList}
												value={locations}
												onChange={(value) => {
													setAttributes({ locations: value }),
														listingsSideEffectChange()
												}}
												isMulti={true}
												closeMenuOnSelect={false}
											/>
										</div>

										<SelectControl
											label={__('Order By', 'classified-listing')}
											options={ORDER_OPTIONS}
											value={orderby}
											onChange={(value) => {
												setAttributes({ orderby: value }),
													listingsSideEffectChange()
											}}
										/>

										<SelectControl
											label={__('Sort By', 'classified-listing')}
											options={SORT_OPTIONS}
											value={sortby}
											onChange={(value) => {
												setAttributes({ sortby: value }),
													listingsSideEffectChange()
											}}
										/>
										<RangeControl
											label={__('Listing Per Page', 'classified-listing')}
											value={perPage}
											onChange={(value) => {
												setAttributes({ perPage: value }),
													listingsSideEffectChange()
											}}
											min={1}
											max={100}
										/>
										<RangeControl
											label={__('Content Limit', 'classified-listing')}
											value={content_limit}
											onChange={(value) => setAttributes({ content_limit: value })}
											min={2}
											max={256}
											step={2}
										/>

										{col_style["style"] === "grid" && (
											<>
												<SelectControl
													label={__('Columns', 'classified-listing')}
													options={COL_OPTIONS}
													value={col_desktop}
													onChange={(value) => {
														setAttributes({ col_desktop: value })
													}}
												/>
												<SelectControl
													label={__('Tablets', 'classified-listing')}
													options={COL_OPTIONS}
													value={col_tablet}
													onChange={(value) => {
														setAttributes({ col_tablet: value })
													}}
												/>
												<SelectControl
													label={__('Phones', 'classified-listing')}
													options={COL_OPTIONS}
													value={col_mobile}
													onChange={(value) => {
														setAttributes({ col_mobile: value })
													}}
												/>
											</>
										)}

										{/* {col_style["style"] === "grid" && (
											<SelectControl
												label={__('Thumbnail Position', 'classified-listing')}
												options={THUMB_POSITIONS}
												value={content_visibility["thumb_position"]}
												onChange={(thumb_position) => setAttributes({
													content_visibility: { ...content_visibility, thumb_position }
												})}
											/>
										)} */}

									</PanelBody>

									<PanelBody title={__("Content Visibility", "classified-listing")} initialOpen={false}>

										<ToggleControl
											label={__("Title", "classified-listing")}
											checked={content_visibility["title"]}
											onChange={(title) => setAttributes({
												content_visibility: { ...content_visibility, title }
											})}
										/>

										<ToggleControl
											label={__("Thumbnail", "classified-listing")}
											checked={content_visibility["thumbnail"]}
											onChange={(thumbnail) => setAttributes({
												content_visibility: { ...content_visibility, thumbnail }
											})}
										/>

										{col_style["style"] == "list" && <ToggleControl
											label={__("Short Content", "classified-listing")}
											checked={content_visibility["content"]}
											onChange={(content) => setAttributes({
												content_visibility: { ...content_visibility, content }
											})}
										/>}

										{col_style["style"] == "grid" && <ToggleControl
											label={__("Short Content", "classified-listing")}
											checked={content_visibility["grid_content"]}
											onChange={(grid_content) => setAttributes({
												content_visibility: { ...content_visibility, grid_content }
											})}
										/>}

										<ToggleControl
											label={__("Badge", "classified-listing")}
											checked={content_visibility["badge"]}
											onChange={(badge) => setAttributes({
												content_visibility: { ...content_visibility, badge }
											})}
										/>

										<ToggleControl
											label={__("Sold", "classified-listing")}
											checked={content_visibility["sold"]}
											onChange={(sold) => setAttributes({
												content_visibility: { ...content_visibility, sold }
											})}
										/>

										<ToggleControl
											label={__("Location", "classified-listing")}
											checked={content_visibility["location"]}
											onChange={(location) => setAttributes({
												content_visibility: { ...content_visibility, location }
											})}
										/>

										<ToggleControl
											label={__("Category", "classified-listing")}
											checked={content_visibility["category"]}
											onChange={(category) => setAttributes({
												content_visibility: { ...content_visibility, category }
											})}
										/>

										<ToggleControl
											label={__("Date", "classified-listing")}
											checked={content_visibility["date"]}
											onChange={(date) => setAttributes({
												content_visibility: { ...content_visibility, date }
											})}
										/>

										<ToggleControl
											label={__("Price", "classified-listing")}
											checked={content_visibility["price"]}
											onChange={(price) => setAttributes({
												content_visibility: { ...content_visibility, price }
											})}
										/>

										<ToggleControl
											label={__("Author", "classified-listing")}
											checked={content_visibility["author"]}
											onChange={(author) => setAttributes({
												content_visibility: { ...content_visibility, author }
											})}
										/>

										<ToggleControl
											label={__("Views", "classified-listing")}
											checked={content_visibility["view"]}
											onChange={(view) => setAttributes({
												content_visibility: { ...content_visibility, view }
											})}
										/>

										<ToggleControl
											label={__("Listing Type", "classified-listing")}
											checked={content_visibility["listing_type"]}
											onChange={(listing_type) => setAttributes({
												content_visibility: { ...content_visibility, listing_type }
											})}
										/>

										{(col_style["style"] == "list" && (col_style["style_list"] == "2" || col_style["style_list"] == "3")) ? (
											<ToggleControl
												label={__("Details Button", "classified-listing")}
												checked={content_visibility["details_btn"]}
												onChange={(details_btn) => setAttributes({
													content_visibility: { ...content_visibility, details_btn }
												})}
											/>
										) : ''}

										{(col_style["style"] == "list" && (col_style["style_list"] == "4" || col_style["style_list"] == "5")) ||
											(col_style["style"] == "grid" && (col_style["style_grid"] == "3" || col_style["style_list"] == "4" || col_style["style_list"] == "5")) ? (
											<>
												<ToggleControl
													label={__("Phone Button", "classified-listing")}
													checked={content_visibility["phone_btn"]}
													onChange={(phone_btn) => setAttributes({
														content_visibility: { ...content_visibility, phone_btn }
													})}
												/>

												<ToggleControl
													label={__("Favourit Button", "classified-listing")}
													checked={content_visibility["favourit_btn"]}
													onChange={(favourit_btn) => setAttributes({
														content_visibility: { ...content_visibility, favourit_btn }
													})}
												/>
												<ToggleControl
													label={__("Quick View Button", "classified-listing")}
													checked={content_visibility["quick_btn"]}
													onChange={(quick_btn) => setAttributes({
														content_visibility: { ...content_visibility, quick_btn }
													})}
												/>
												<ToggleControl
													label={__("Compare  Button", "classified-listing")}
													checked={content_visibility["compare_btn"]}
													onChange={(compare_btn) => setAttributes({
														content_visibility: { ...content_visibility, compare_btn }
													})}
												/>
											</>
										) : ''}

										<ToggleControl
											label={__("Pagination", "classified-listing")}
											checked={content_visibility["pagination"]}
											onChange={(pagination) => setAttributes({
												content_visibility: { ...content_visibility, pagination }
											})}
										/>

									</PanelBody>

								</>
							)}

							{tab.name === "styles" && (
								<>
									<PanelBody title={__("Item Wrapper", "classified-listing")} initialOpen={true}>
										<BaseControl label={__("Background", "classified-listing")}>
											<ColorPalette
												className="rtcl-gb-colorpalette"
												colors={COLORS}
												value={col_style["bg-color"]}
												onChange={(newColor) => setAttributes({
													col_style: { ...col_style, "bg-color": newColor }
												})}
											/>
										</BaseControl>

										<BaseControl>
											<UnitControlCustom
												selectedUnit={col_padding["unit"]}
												unitTypes={[
													{ label: "px", value: "px" },
													{ label: "em", value: "em" },
													{ label: "%", value: "%" },
												]}
												onClick={(unit) => setAttributes({
													col_padding: { ...col_padding, unit },
												})
												}
											/>
											<DimensionsControl
												label={__("Wrapper Spacing", "classified-listing")}
												top={col_padding["top"]}
												right={col_padding["right"]}
												bottom={col_padding["bottom"]}
												left={col_padding["left"]}
												onChange={({ top, right, bottom, left }) => setAttributes({
													col_padding: { ...col_padding, top, bottom, left, right },
												})
												}
											/>
										</BaseControl>

										<BaseControl>
											<UnitControlCustom
												selectedUnit={col_style["gsUnit"]}
												unitTypes={[
													{ label: "px", value: "px" },
													{ label: "em", value: "em" },
													{ label: "%", value: "%" },
												]}
												onClick={(gsUnit) => setAttributes({
													col_style: { ...col_style, gsUnit },
												})
												}
											/>

											<RangeControl
												label={__("Gutter Spacing", "classified-listing")}
												value={col_style["gutterSpace"]}
												onChange={(gutterSpace) => setAttributes({
													col_style: { ...col_style, gutterSpace }
												})}
												min={0}
												step={GUTTER_SPACE_STEP}
												max={GUTTER_SPACE_MAX}
											/>
										</BaseControl>

										<BaseControl>
											<UnitControlCustom
												selectedUnit={content_padding["unit"]}
												unitTypes={[
													{ label: "px", value: "px" },
													{ label: "em", value: "em" },
													{ label: "%", value: "%" },
												]}
												onClick={(unit) => setAttributes({
													content_padding: { ...content_padding, unit },
												})
												}
											/>
											<DimensionsControl
												label={__("Content Spacing", "classified-listing")}
												top={content_padding["top"]}
												right={content_padding["right"]}
												bottom={content_padding["bottom"]}
												left={content_padding["left"]}
												onChange={({ top, right, bottom, left }) => setAttributes({
													content_padding: { ...content_padding, top, bottom, left, right },
												})
												}
											/>
										</BaseControl>

										<PanelBody title={__("Border")} initialOpen={false}>
											<ColorControl
												label={__("Border Color")}
												color={col_style["border-color"]}
												onChange={(val) => setAttributes({
													col_style: { ...col_style, "border-color": val }
												})
												}
											/>

											<BaseControl label={__("Width", "classified-listing")}>
												<UnitControl
													value={col_style["border-width"]}
													onChange={(val) => setAttributes({
														col_style: { ...col_style, "border-width": val }
													})
													}
												/>
											</BaseControl>

											<BaseControl label={__("Radius", "classified-listing")}>
												<UnitControl
													value={col_style["border-radius"]}
													onChange={(val) => setAttributes({
														col_style: { ...col_style, "border-radius": val }
													})
													}
												/>
											</BaseControl>
										</PanelBody>
									</PanelBody>

									<PanelBody title={__("Promotion")} initialOpen={false}>
										<ColorControl
											label={__("Featured Background Color")}
											color={promotion_style["featuredBGColor"]}
											onChange={(featuredBGColor) => setAttributes({
												promotion_style: { ...promotion_style, featuredBGColor }
											})}
										/>

										<ColorControl
											label={__("Featured Border Color")}
											color={promotion_style["featuredBDColor"]}
											onChange={(featuredBDColor) => setAttributes({
												promotion_style: { ...promotion_style, featuredBDColor }
											})
											}
										/>
									</PanelBody>

									<PanelBody title={__("Title", "classified-listing")} initialOpen={false}>
										<BaseControl label={__("Typography")} className="rtcl-gb-typography-base">
											<Dropdown
												className="rtcl-gb-typography-dropdown"
												contentClassName="my-popover-content-classname"
												position="bottom right"
												renderToggle={({ isOpen, onToggle }) => (
													<Button
														isSmall
														onClick={onToggle}
														aria-expanded={isOpen}
														icon="edit"
													></Button>
												)}
												renderContent={() => (

													<div className="rtcl-panel-control rtcl-gb-typography-component-panel">


														<UnitControlCustom
															selectedUnit={title_style["fsUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "%", value: "%" },
																{ label: "em", value: "em" },
															]}
															onClick={(fsUnit) => setAttributes({
																title_style: { ...title_style, "fsUnit": fsUnit }
															})}
														/>

														<RangeControl
															label={__("Font Size")}
															value={title_style["fontSize"]}
															onChange={(fontSize) => setAttributes({
																title_style: { ...title_style, "fontSize": fontSize }
															})}
															min={0}
															step={FONT_SIZE_STEP}
															max={FONT_SIZE_MAX}
														/>

														<SelectControl
															label={__("Font Weight")}
															value={title_style["fontWeight"]}
															options={FONT_WEIGHTS}
															onChange={(fontWeight) => setAttributes({
																title_style: { ...title_style, fontWeight }
															})}
														/>

														<SelectControl
															label={__("Text Transform")}
															value={title_style["textTransform"]}
															options={TEXT_TRANSFORM}
															onChange={(textTransform) => setAttributes({
																title_style: { ...title_style, textTransform }
															})}
														/>

														<UnitControlCustom
															selectedUnit={title_style["lsUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "em", value: "em" },
															]}
															onClick={(lsUnit) => setAttributes({
																title_style: { ...title_style, lsUnit }
															})}
														/>

														<RangeControl
															label={__("Letter Spacing")}
															value={title_style["letterSpacing"]}
															onChange={(letterSpacing) => setAttributes({
																title_style: { ...title_style, letterSpacing }
															})}
															min={0}
															max={SPACING_MAX}
															step={SPACING_STEP}
														/>

														<UnitControlCustom
															selectedUnit={title_style["lhUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "em", value: "em" },
															]}
															onClick={(lhUnit) => setAttributes({
																title_style: { ...title_style, lhUnit }
															})}
														/>

														<RangeControl
															label={__("Line Height")}
															value={title_style["lineHeight"]}
															onChange={(lineHeight) => setAttributes({
																title_style: { ...title_style, lineHeight }
															})}
															min={-1}
															max={LINE_HEIGHT_MAX}
															step={LINE_HEIGHT_STEP}
														/>
													</div>
												)}
											/>
										</BaseControl>

										<ButtonGroup className="rtcl-gb-inspector-btn-group">
											{NORMAL_HOVER.map((item) => (
												<Button
													isLarge
													isPrimary={title_style["colorStyle"] === item.value}
													isSecondary={title_style["colorStyle"] !== item.value}
													onClick={() => setAttributes({
														title_style: { ...title_style, "colorStyle": item.value }
													})}
												>
													{item.label}
												</Button>
											))}
										</ButtonGroup>


										{title_style["colorStyle"] === "normal" && (
											<PanelColorSettings
												className={"rtcl-gb-subpanel-bg"}
												colorSettings={[{
													value: title_style["color"],
													onChange: (newColor) => setAttributes({
														title_style: { ...title_style, "color": newColor }
													}),
													label: __("Color"),
												}]}
											/>
										)}

										{title_style["colorStyle"] === "hover" && (
											<PanelColorSettings
												className={"rtcl-gb-subpanel-bg"}
												colorSettings={[{
													value: title_style["hvColor"],
													onChange: (hvColor) => setAttributes({
														title_style: { ...title_style, hvColor }
													}),
													label: __("Hover Color"),
												}]}
											/>
										)}
									</PanelBody>

									<PanelBody title={__("Badge", "classified-listing")} initialOpen={false}>
										<BaseControl label={__("Sold Typography")} className="rtcl-gb-typography-base">
											<Dropdown
												className="rtcl-gb-typography-dropdown"
												contentClassName="my-popover-content-classname"
												position="bottom right"
												renderToggle={({ isOpen, onToggle }) => (
													<Button
														isSmall
														onClick={onToggle}
														aria-expanded={isOpen}
														icon="edit"
													></Button>
												)}
												renderContent={() => (
													<div className="rtcl-panel-control rtcl-gb-typography-component-panel">
														<UnitControlCustom
															selectedUnit={sold_style["fsUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "%", value: "%" },
																{ label: "em", value: "em" },
															]}
															onClick={(fsUnit) => setAttributes({
																sold_style: { ...sold_style, "fsUnit": fsUnit }
															})}
														/>

														<RangeControl
															label={__("Font Size")}
															value={sold_style["fontSize"]}
															onChange={(fontSize) => setAttributes({
																sold_style: { ...sold_style, "fontSize": fontSize }
															})}
															min={0}
															step={FONT_SIZE_STEP}
															max={FONT_SIZE_MAX}
														/>

														<SelectControl
															label={__("Font Weight")}
															value={sold_style["fontWeight"]}
															options={FONT_WEIGHTS}
															onChange={(fontWeight) => setAttributes({
																sold_style: { ...sold_style, fontWeight }
															})}
														/>

														<SelectControl
															label={__("Text Transform")}
															value={sold_style["textTransform"]}
															options={TEXT_TRANSFORM}
															onChange={(textTransform) => setAttributes({
																sold_style: { ...sold_style, textTransform }
															})}
														/>

														<UnitControlCustom
															selectedUnit={sold_style["lsUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "em", value: "em" },
															]}
															onClick={(lsUnit) => setAttributes({
																sold_style: { ...sold_style, lsUnit }
															})}
														/>

														<RangeControl
															label={__("Letter Spacing")}
															value={sold_style["letterSpacing"]}
															onChange={(letterSpacing) => setAttributes({
																sold_style: { ...sold_style, letterSpacing }
															})}
															min={0}
															max={SPACING_MAX}
															step={SPACING_STEP}
														/>

														<UnitControlCustom
															selectedUnit={sold_style["lhUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "em", value: "em" },
															]}
															onClick={(lhUnit) => setAttributes({
																sold_style: { ...sold_style, lhUnit }
															})}
														/>

														<RangeControl
															label={__("Line Height")}
															value={sold_style["lineHeight"]}
															onChange={(lineHeight) => setAttributes({
																sold_style: { ...sold_style, lineHeight }
															})}
															min={-1}
															max={LINE_HEIGHT_MAX}
															step={LINE_HEIGHT_STEP}
														/>
													</div>
												)}
											/>
										</BaseControl>
										<ColorControl
											label={__("Sold Background Color")}
											color={sold_style["soldBGColor"]}
											onChange={(soldBGColor) => setAttributes({
												sold_style: { ...sold_style, soldBGColor }
											})}
										/>
										<ColorControl
											label={__("Sold Color")}
											color={sold_style["soldColor"]}
											onChange={(soldColor) => setAttributes({
												sold_style: { ...sold_style, soldColor }
											})}
										/>

										<BaseControl label={__("Badge Typography")} className="rtcl-gb-typography-base">
											<Dropdown
												className="rtcl-gb-typography-dropdown"
												contentClassName="my-popover-content-classname"
												position="bottom right"
												renderToggle={({ isOpen, onToggle }) => (
													<Button
														isSmall
														onClick={onToggle}
														aria-expanded={isOpen}
														icon="edit"
													></Button>
												)}
												renderContent={() => (
													<div className="rtcl-panel-control rtcl-gb-typography-component-panel">
														<UnitControlCustom
															selectedUnit={badge_style["fsUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "%", value: "%" },
																{ label: "em", value: "em" },
															]}
															onClick={(fsUnit) => setAttributes({
																badge_style: { ...badge_style, "fsUnit": fsUnit }
															})}
														/>

														<RangeControl
															label={__("Font Size")}
															value={badge_style["fontSize"]}
															onChange={(fontSize) => setAttributes({
																badge_style: { ...badge_style, "fontSize": fontSize }
															})}
															min={0}
															step={FONT_SIZE_STEP}
															max={FONT_SIZE_MAX}
														/>

														<SelectControl
															label={__("Font Weight")}
															value={badge_style["fontWeight"]}
															options={FONT_WEIGHTS}
															onChange={(fontWeight) => setAttributes({
																badge_style: { ...badge_style, fontWeight }
															})}
														/>

														<SelectControl
															label={__("Text Transform")}
															value={badge_style["textTransform"]}
															options={TEXT_TRANSFORM}
															onChange={(textTransform) => setAttributes({
																badge_style: { ...badge_style, textTransform }
															})}
														/>

														<UnitControlCustom
															selectedUnit={badge_style["lsUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "em", value: "em" },
															]}
															onClick={(lsUnit) => setAttributes({
																badge_style: { ...badge_style, lsUnit }
															})}
														/>

														<RangeControl
															label={__("Letter Spacing")}
															value={badge_style["letterSpacing"]}
															onChange={(letterSpacing) => setAttributes({
																badge_style: { ...badge_style, letterSpacing }
															})}
															min={0}
															max={SPACING_MAX}
															step={SPACING_STEP}
														/>

														<UnitControlCustom
															selectedUnit={badge_style["lhUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "em", value: "em" },
															]}
															onClick={(lhUnit) => setAttributes({
																badge_style: { ...badge_style, lhUnit }
															})}
														/>

														<RangeControl
															label={__("Line Height")}
															value={badge_style["lineHeight"]}
															onChange={(lineHeight) => setAttributes({
																badge_style: { ...badge_style, lineHeight }
															})}
															min={-1}
															max={LINE_HEIGHT_MAX}
															step={LINE_HEIGHT_STEP}
														/>
													</div>
												)}
											/>
										</BaseControl>

										<ColorControl
											label={__("New Background Color")}
											color={badge_style["newBGColor"]}
											onChange={(newBGColor) => setAttributes({
												badge_style: { ...badge_style, newBGColor }
											})}
										/>
										<ColorControl
											label={__("New Color")}
											color={badge_style["newColor"]}
											onChange={(newColor) => setAttributes({
												badge_style: { ...badge_style, newColor }
											})}
										/>
										<ColorControl
											label={__("Featured Background Color")}
											color={badge_style["featuredBGColor"]}
											onChange={(featuredBGColor) => setAttributes({
												badge_style: { ...badge_style, featuredBGColor }
											})}
										/>
										<ColorControl
											label={__("Featured Color")}
											color={badge_style["featuredColor"]}
											onChange={(featuredColor) => setAttributes({
												badge_style: { ...badge_style, featuredColor }
											})}
										/>
										<ColorControl
											label={__("Top Background Color")}
											color={badge_style["topBGColor"]}
											onChange={(topBGColor) => setAttributes({
												badge_style: { ...badge_style, topBGColor }
											})}
										/>
										<ColorControl
											label={__("Top Color")}
											color={badge_style["topColor"]}
											onChange={(topColor) => setAttributes({
												badge_style: { ...badge_style, topColor }
											})}
										/>

										<ColorControl
											label={__("Popular Background Color")}
											color={badge_style["popularBGColor"]}
											onChange={(popularBGColor) => setAttributes({
												badge_style: { ...badge_style, popularBGColor }
											})}
										/>
										<ColorControl
											label={__("Popular Color")}
											color={badge_style["popularColor"]}
											onChange={(popularColor) => setAttributes({
												badge_style: { ...badge_style, popularColor }
											})}
										/>

										<ColorControl
											label={__("BumpUp Background Color")}
											color={badge_style["bumpBGColor"]}
											onChange={(bumpBGColor) => setAttributes({
												badge_style: { ...badge_style, bumpBGColor }
											})}
										/>
										<ColorControl
											label={__("BumpUp Color")}
											color={badge_style["bumpColor"]}
											onChange={(bumpColor) => setAttributes({
												badge_style: { ...badge_style, bumpColor }
											})}
										/>




									</PanelBody>

									<PanelBody title={__("Meta", "classified-listing")} initialOpen={false}>

										<UnitControlCustom
											selectedUnit={content_margin["unit"]}
											unitTypes={[
												{ label: "px", value: "px" },
												{ label: "em", value: "em" },
												{ label: "%", value: "%" },
											]}
											onClick={(unit) => setAttributes({
												content_margin: { ...content_margin, unit },
											})
											}
										/>
										<DimensionsControl
											label={__("Meta Spacing", "classified-listing")}
											top={content_margin["top"]}
											right={content_margin["right"]}
											bottom={content_margin["bottom"]}
											left={content_margin["left"]}
											onChange={({ top, right, bottom, left }) => setAttributes({
												content_margin: { ...content_margin, top, bottom, left, right },
											})
											}
										/>

										<BaseControl label={__("Typography")} className="rtcl-gb-typography-base">
											<Dropdown
												className="rtcl-gb-typography-dropdown"
												contentClassName="my-popover-content-classname"
												position="bottom right"
												renderToggle={({ isOpen, onToggle }) => (
													<Button
														isSmall
														onClick={onToggle}
														aria-expanded={isOpen}
														icon="edit"
													></Button>
												)}
												renderContent={() => (
													<div className="rtcl-panel-control rtcl-gb-typography-component-panel">
														<UnitControlCustom
															selectedUnit={meta_style["fsUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "%", value: "%" },
																{ label: "em", value: "em" },
															]}
															onClick={(fsUnit) => setAttributes({
																meta_style: { ...meta_style, "fsUnit": fsUnit }
															})}
														/>

														<RangeControl
															label={__("Font Size")}
															value={meta_style["fontSize"]}
															onChange={(fontSize) => setAttributes({
																meta_style: { ...meta_style, "fontSize": fontSize }
															})}
															min={0}
															step={FONT_SIZE_STEP}
															max={FONT_SIZE_MAX}
														/>

														<SelectControl
															label={__("Font Weight")}
															value={meta_style["fontWeight"]}
															options={FONT_WEIGHTS}
															onChange={(fontWeight) => setAttributes({
																meta_style: { ...meta_style, fontWeight }
															})}
														/>

														<SelectControl
															label={__("Text Transform")}
															value={meta_style["textTransform"]}
															options={TEXT_TRANSFORM}
															onChange={(textTransform) => setAttributes({
																meta_style: { ...meta_style, textTransform }
															})}
														/>

														<UnitControlCustom
															selectedUnit={meta_style["lsUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "em", value: "em" },
															]}
															onClick={(lsUnit) => setAttributes({
																meta_style: { ...meta_style, lsUnit }
															})}
														/>

														<RangeControl
															label={__("Letter Spacing")}
															value={meta_style["letterSpacing"]}
															onChange={(letterSpacing) => setAttributes({
																meta_style: { ...meta_style, letterSpacing }
															})}
															min={0}
															max={SPACING_MAX}
															step={SPACING_STEP}
														/>

														<UnitControlCustom
															selectedUnit={meta_style["lhUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "em", value: "em" },
															]}
															onClick={(lhUnit) => setAttributes({
																meta_style: { ...meta_style, lhUnit }
															})}
														/>

														<RangeControl
															label={__("Line Height")}
															value={meta_style["lineHeight"]}
															onChange={(lineHeight) => setAttributes({
																meta_style: { ...meta_style, lineHeight }
															})}
															min={-1}
															max={LINE_HEIGHT_MAX}
															step={LINE_HEIGHT_STEP}
														/>
													</div>
												)}
											/>
										</BaseControl>

										<ColorControl
											label={__("Color")}
											color={meta_style["color"]}
											onChange={(newColor) => setAttributes({
												meta_style: { ...meta_style, "color": newColor }
											})}
										/>

										<ColorControl
											label={__("Icon Color")}
											color={meta_style["iconColor"]}
											onChange={(iconColor) => setAttributes({
												meta_style: { ...meta_style, iconColor }
											})}
										/>

									</PanelBody>

									<PanelBody title={__("Price", "classified-listing")} initialOpen={false}>
										<ColorControl
											label={__("Background Color")}
											color={price_style["bgColor"]}
											onChange={(bgColor) => setAttributes({
												price_style: { ...price_style, bgColor }
											})}
										/>

										<ColorControl
											label={__("Text Color")}
											color={price_style["color"]}
											onChange={(newColor) => setAttributes({
												price_style: { ...price_style, "color": newColor }
											})}
										/>
										<UnitControlCustom
											selectedUnit={price_style["fsUnit"]}
											unitTypes={[
												{ label: "px", value: "px" },
												{ label: "%", value: "%" },
												{ label: "em", value: "em" },
											]}
											onClick={(fsUnit) => setAttributes({
												price_style: { ...price_style, fsUnit }
											})}
										/>

										<RangeControl
											label={__("Price Font Size")}
											value={price_style["fontSize"]}
											onChange={(fontSize) => setAttributes({
												price_style: { ...price_style, fontSize }
											})}
											min={0}
											step={FONT_SIZE_STEP}
											max={FONT_SIZE_MAX}
										/>

										<SelectControl
											label={__("Price Font Weight")}
											value={price_style["fontWeight"]}
											options={FONT_WEIGHTS}
											onChange={(fontWeight) => setAttributes({
												price_style: { ...price_style, fontWeight }
											})}
										/>

										<ColorControl
											label={__("Unit Label Text Color")}
											color={price_style["unitLabelColor"]}
											onChange={(unitLabelColor) => setAttributes({
												price_style: { ...price_style, unitLabelColor }
											})}
										/>
										<UnitControlCustom
											selectedUnit={price_style["unitLFSizeUnit"]}
											unitTypes={[
												{ label: "px", value: "px" },
												{ label: "%", value: "%" },
												{ label: "em", value: "em" },
											]}
											onClick={(unitLFSizeUnit) => setAttributes({
												price_style: { ...price_style, unitLFSizeUnit }
											})}
										/>

										<RangeControl
											label={__("Unit Label Font Size")}
											value={price_style["unitLFSize"]}
											onChange={(unitLFSize) => setAttributes({
												price_style: { ...price_style, unitLFSize }
											})}
											min={0}
											step={FONT_SIZE_STEP}
											max={FONT_SIZE_MAX}
										/>

										<SelectControl
											label={__("Unit Label Font Weight")}
											value={price_style["unitLFSizeWeight"]}
											options={FONT_WEIGHTS}
											onChange={(unitLFSizeWeight) => setAttributes({
												price_style: { ...price_style, unitLFSizeWeight }
											})}
										/>

									</PanelBody>


									{col_style["style"] == "list" || (col_style["style"] == "grid" &&
										(col_style["style_grid"] == "3" || col_style["style_grid"] == "4")) ?
										<PanelBody title={__("Button", "classified-listing")} initialOpen={false}>
											<ColorControl
												label={__("BG Color")}
												color={button_style["bgColor"]}
												onChange={(bgColor) => setAttributes({
													button_style: { ...button_style, bgColor }
												})}
											/>

											<ColorControl
												label={__("Hover BG Color")}
												color={button_style["hvBGColor"]}
												onChange={(hvBGColor) => setAttributes({
													button_style: { ...button_style, hvBGColor }
												})}
											/>

											<ColorControl
												label={__("Text Color")}
												color={button_style["color"]}
												onChange={(newColor) => setAttributes({
													button_style: { ...button_style, "color": newColor }
												})}
											/>

											<ColorControl
												label={__("Hover Text Color")}
												color={button_style["hvColor"]}
												onChange={(hvColor) => setAttributes({
													button_style: { ...button_style, hvColor }
												})}
											/>

										</PanelBody>
										: ""}


									<PanelBody title={__("Content", "classified-listing")} initialOpen={false}>

										<UnitControlCustom
											selectedUnit={content_margin["unit"]}
											unitTypes={[
												{ label: "px", value: "px" },
												{ label: "em", value: "em" },
												{ label: "%", value: "%" },
											]}
											onClick={(unit) => setAttributes({
												content_margin: { ...content_margin, unit },
											})
											}
										/>
										<DimensionsControl
											label={__("Content Spacing", "classified-listing")}
											top={content_margin["top"]}
											right={content_margin["right"]}
											bottom={content_margin["bottom"]}
											left={content_margin["left"]}
											onChange={({ top, right, bottom, left }) => setAttributes({
												content_margin: { ...content_margin, top, bottom, left, right },
											})
											}
										/>

										<BaseControl label={__("Typography")} className="rtcl-gb-typography-base">
											<Dropdown
												className="rtcl-gb-typography-dropdown"
												contentClassName="my-popover-content-classname"
												position="bottom right"
												renderToggle={({ isOpen, onToggle }) => (
													<Button
														isSmall
														onClick={onToggle}
														aria-expanded={isOpen}
														icon="edit"
													></Button>
												)}
												renderContent={() => (
													<div className="rtcl-panel-control rtcl-gb-typography-component-panel">
														<UnitControlCustom
															selectedUnit={content_style["fsUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "%", value: "%" },
																{ label: "em", value: "em" },
															]}
															onClick={(fsUnit) => setAttributes({
																content_style: { ...content_style, "fsUnit": fsUnit }
															})}
														/>

														<RangeControl
															label={__("Font Size")}
															value={content_style["fontSize"]}
															onChange={(fontSize) => setAttributes({
																content_style: { ...content_style, "fontSize": fontSize }
															})}
															min={0}
															step={FONT_SIZE_STEP}
															max={FONT_SIZE_MAX}
														/>

														<SelectControl
															label={__("Font Weight")}
															value={content_style["fontWeight"]}
															options={FONT_WEIGHTS}
															onChange={(fontWeight) => setAttributes({
																content_style: { ...content_style, fontWeight }
															})}
														/>

														<SelectControl
															label={__("Text Transform")}
															value={content_style["textTransform"]}
															options={TEXT_TRANSFORM}
															onChange={(textTransform) => setAttributes({
																content_style: { ...content_style, textTransform }
															})}
														/>

														<UnitControlCustom
															selectedUnit={content_style["lsUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "em", value: "em" },
															]}
															onClick={(lsUnit) => setAttributes({
																content_style: { ...content_style, lsUnit }
															})}
														/>

														<RangeControl
															label={__("Letter Spacing")}
															value={content_style["letterSpacing"]}
															onChange={(letterSpacing) => setAttributes({
																content_style: { ...content_style, letterSpacing }
															})}
															min={0}
															max={SPACING_MAX}
															step={SPACING_STEP}
														/>

														<UnitControlCustom
															selectedUnit={content_style["lhUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "em", value: "em" },
															]}
															onClick={(lhUnit) => setAttributes({
																content_style: { ...content_style, lhUnit }
															})}
														/>

														<RangeControl
															label={__("Line Height")}
															value={content_style["lineHeight"]}
															onChange={(lineHeight) => setAttributes({
																content_style: { ...content_style, lineHeight }
															})}
															min={-1}
															max={LINE_HEIGHT_MAX}
															step={LINE_HEIGHT_STEP}
														/>


													</div>
												)}
											/>
										</BaseControl>

									</PanelBody>
								</>
							)}

							{tab.name === "advance" && (
								<>
									<PanelBody>
										<UnitControlCustom
											selectedUnit={container_padding["unit"]}
											unitTypes={[
												{ label: "px", value: "px" },
												{ label: "em", value: "em" },
												{ label: "%", value: "%" },
											]}
											onClick={(unit) => setAttributes({
												container_padding: { ...container_padding, unit },
											})
											}
										/>
										<DimensionsControl
											label={__("Main Wrapper Padding", "classified-listing")}
											top={container_padding["top"]}
											right={container_padding["right"]}
											bottom={container_padding["bottom"]}
											left={container_padding["left"]}
											onChange={({ top, right, bottom, left }) => setAttributes({
												container_padding: { ...container_padding, top, bottom, left, right },
											})
											}
										/>
										<UnitControlCustom
											selectedUnit={container_margin["unit"]}
											unitTypes={[
												{ label: "px", value: "px" },
												{ label: "em", value: "em" },
												{ label: "%", value: "%" },
											]}
											onClick={(unit) => setAttributes({
												container_margin: { ...container_margin, unit },
											})
											}
										/>
										<DimensionsControl
											label={__("Main Wrapper Margin", "classified-listing")}
											top={container_margin["top"]}
											right={container_margin["right"]}
											bottom={container_margin["bottom"]}
											left={container_margin["left"]}
											onChange={({ top, right, bottom, left }) => setAttributes({
												container_margin: { ...container_margin, top, bottom, left, right },
											})
											}
										/>
										<PanelColorSettings
											className={"rtcl-gb-subpanel"}
											title={__("Background Color")}
											initialOpen={true}
											colorSettings={[{
												value: container_style["bgColor"],
												onChange: (newColor) => setAttributes({
													container_style: { ...meta_style, "bgColor": newColor }
												}),
												label: __("Color"),
											}]}
										/>
									</PanelBody>
								</>
							)}

						</div>
					)}
				</TabPanel>
			</div>
		</InspectorControls>
	)

}

export default Inspector;