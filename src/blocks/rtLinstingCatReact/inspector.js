//wordpress dependencies
const { __ } = wp.i18n;
const { InspectorControls, PanelColorSettings, MediaUpload } = wp.blockEditor;
import {
	BaseControl, Button, ButtonGroup, Dropdown, PanelBody, RangeControl, SelectControl, TabPanel, ToggleControl, __experimentalUnitControl as UnitControlEMG
} from "@wordpress/components";
import axios from "axios";
import Qs from 'qs';
import Select from 'react-select';
import ColorControl from "../../util/color-control";
import DimensionsControl from "../../util/dimensions-control";
import UnitControl from "../../util/unit-control";
import { COL_OPTIONS, FONT_WEIGHTS, ICON_OPTIONS, NORMAL_HOVER, ORDER_OPTIONS, SORT_OPTIONS, STYLE_OPTIONS, TEXT_TRANSFORM } from "./constants";
const { useEffect, useState } = wp.element;
const { select } = wp.data;

function Inspector(props) {
	const { attributes, setAttributes, catSideQueryChange } = props;
	const {
		cats,
		orderby,
		sortby,
		hide_empty,
		icon_type,
		content_limit,
		category_limit,
		sub_category_limit,
		sub_cat_style,
		sub_cat_padding,

		col_desktop,
		col_tablet,
		col_mobile,
		content_visibility,
		col_padding,
		col_style,
		icon_style,
		title_style,
		counter_style,
		content_style,

		container_padding,
		container_margin,
		container_style

	} = attributes;

	const TITLE_SIZE_MAX = title_style["fsUnit"] === "em" ? 10 : 100;
	const TITLE_SIZE_STEP = title_style["fsUnit"] === "em" ? 0.1 : 1;

	const GUTTER_SPACE_MAX = col_style["gsUnit"] === "em" ? 10 : 100;
	const GUTTER_SPACE_STEP = col_style["gsUnit"] === "em" ? 0.1 : 1;

	const TITLE_SPACING_MAX = title_style["lsUnit"] === "em" ? 10 : 10;
	const TITLE_SPACING_STEP = title_style["lsUnit"] === "em" ? 0.1 : 1;

	const TITLE_LINE_HEIGHT_MAX = title_style["lhUnit"] === "em" ? 10 : 100;
	const TITLE_LINE_HEIGHT_STEP = title_style["lhUnit"] === "em" ? 0.1 : 1;

	const [catList, setCatList] = useState([]);

	useEffect(() => {
		let data = {
			action: 'rtcl_gb_categories',
			rtcl_nonce: rtcl_block_script.rtcl_nonce,
			portion: 'catbox'
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

	return (
		<InspectorControls key="controls">
			<div className="rtcl-gb-panel-control">
				<TabPanel
					className="rtcl-gb-parent-tab-panel"
					activeClass="active-tab"
					// onSelect={onSelect}
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
											label={__('Style', 'classified-listing')}
											options={STYLE_OPTIONS}
											value={col_style["style"]}
											onChange={(style) => {
												setAttributes({ col_style: { ...col_style, style } })
											}}
										/>

										<div className="components-base-control__field">
											<label className="components-base-control__label" htmlFor="react-select-2-input">{__('Categories', 'classified-listing')}</label>
											<Select
												options={catList}
												value={cats}
												onChange={(value) => {
													setAttributes({ cats: value }),
														catSideQueryChange()
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
													catSideQueryChange()
											}}
										/>

										<SelectControl
											label={__('Short By', 'classified-listing')}
											options={SORT_OPTIONS}
											value={sortby}
											onChange={(value) => {
												setAttributes({ sortby: value }),
													catSideQueryChange()
											}}
										/>

										<ToggleControl
											label={__("Hide Epmpty", "classified-listing")}
											checked={hide_empty}
											onChange={() => {
												setAttributes({ hide_empty: !hide_empty }),
													catSideQueryChange()
											}}
										/>

										<SelectControl
											label={__('Icon Type', 'classified-listing')}
											options={ICON_OPTIONS}
											value={icon_type}
											onChange={(value) => {
												setAttributes({ icon_type: value }),
													catSideQueryChange()
											}}
										/>
										<RangeControl
											label={__('Category Limit', 'classified-listing')}
											value={category_limit}
											onChange={(value) => {
												setAttributes({ category_limit: value }),
													catSideQueryChange()
											}}
											min={1}
											max={100}
										/>

										<RangeControl
											label={__('Sub Category Limit', 'classified-listing')}
											value={sub_category_limit}
											onChange={(value) => {
												setAttributes({ sub_category_limit: value }),
													catSideQueryChange()
											}}
											min={1}
											max={100}
										/>

										<ToggleControl
											label={__("Listing Count", "classified-listing")}
											checked={content_visibility["counter"]}
											onChange={(counter) => {
												setAttributes({ content_visibility: { ...content_visibility, counter } })

											}}
										/>

										<ToggleControl
											label={__("Description", "classified-listing")}
											checked={content_visibility["catDesc"]}
											onChange={(catDesc) => {
												setAttributes({
													content_visibility: { ...content_visibility, catDesc }
												})
											}}
										/>
										<ToggleControl
											label={__("Icon Display", "classified-listing")}
											checked={content_visibility["icon"]}
											onChange={(icon) => {
												setAttributes({
													content_visibility: { ...content_visibility, icon }
												})
											}}
										/>
										<ToggleControl
											label={__("Sub Category show", "classified-listing")}
											checked={content_visibility["subCat"]}
											onChange={(subCat) => {
												setAttributes({ content_visibility: { ...content_visibility, subCat } })
											}}
										/>

										<RangeControl
											label={__('Content Limit', 'classified-listing')}
											value={content_limit}
											onChange={(value) => setAttributes({ content_limit: value })}
											min={2}
											max={100}
										/>

									</PanelBody>

									<PanelBody title={__('Number of Responsive cols', 'classified-listing')}>
										<RangeControl
											label={__("Gutter Speacing", "classified-listing")}
											value={col_style["gutterSpace"]}
											onChange={(gutterSpace) => setAttributes({
												col_style: { ...col_style, gutterSpace }
											})}
											min={0}
											step={GUTTER_SPACE_STEP}
											max={GUTTER_SPACE_MAX}
										/>
										<SelectControl
											label={__('Desktops', 'classified-listing')}
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
									</PanelBody>

								</>
							)}

							{tab.name === "styles" && (
								<>
									<PanelBody title={__("Box", "classified-listing")} initialOpen={true}>

										<UnitControl
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

										<UnitControl
											selectedUnit={col_padding["unit"]}
											unitTypes={[
												{ label: "px", value: "px" },
												{ label: "em", value: "em" },
												{ label: "%", value: "%" },
											]}
											onClick={(unit) =>
												setAttributes({
													col_padding: { ...col_padding, unit }
												})
											}
										/>

										<DimensionsControl
											label={__("Padding", "classified-listing")}
											top={col_padding["top"]}
											right={col_padding["right"]}
											bottom={col_padding["bottom"]}
											left={col_padding["left"]}
											onChange={({ top, right, bottom, left }) =>
												setAttributes({
													col_padding: { ...col_padding, top, bottom, left, right }
												})
											}
										/>

										<PanelBody title={__("Background")} initialOpen={false}>
											<ButtonGroup className="rtcl-gb-inspector-btn-group">
												{NORMAL_HOVER.map((item) => (
													<Button
														isLarge
														isPrimary={col_style["bgStyle"] === item.value}
														isSecondary={col_style["bgStyle"] !== item.value}
														onClick={() => setAttributes({
															col_style: { ...col_style, bgStyle: item.value }
														})}
													>
														{item.label}
													</Button>
												))}
											</ButtonGroup>
											{col_style["bgStyle"] === "normal" && (
												<PanelColorSettings
													className={"rtcl-gb-subpanel-bg"}
													colorSettings={[
														{
															value: col_style["bgColor"],
															onChange: (bgColor) =>
																setAttributes({
																	col_style: { ...col_style, bgColor }
																}),
															label: __("Color"),
														}
													]}
												/>
											)}

											{col_style["bgStyle"] === "hover" && (
												<PanelColorSettings
													className={"rtcl-gb-subpanel-bg"}
													colorSettings={[
														{
															value: col_style["hvBGColor"],
															onChange: (hvBGColor) =>
																setAttributes({ col_style: { ...col_style, hvBGColor } }),
															label: __("Hover Color"),
														}
													]}
												/>
											)}
										</PanelBody>

										<PanelBody title={__("Border")} initialOpen={false}>
											<ColorControl
												label={__("Border Color")}
												color={col_style["borderColor"]}
												onChange={(borderColor) => setAttributes({
													col_style: { ...col_style, borderColor }
												})
												}
											/>

											<BaseControl label={__("Width", "classified-listing")}>
												<UnitControlEMG
													value={col_style["borderWidth"]}
													onChange={(borderWidth) => setAttributes({
														col_style: { ...col_style, borderWidth }
													})
													}
												/>
											</BaseControl>

											<BaseControl label={__("Radius Width", "classified-listing")}>
												<UnitControlEMG
													value={col_style["borderRadius"]}
													onChange={(borderRadius) => setAttributes({
														col_style: { ...col_style, borderRadius }
													})
													}
												/>
											</BaseControl>
										</PanelBody>

									</PanelBody>

									<PanelBody title={__("Icon", "classified-listing")} initialOpen={false}>
										<ButtonGroup className="rtcl-gb-inspector-btn-group">
											{NORMAL_HOVER.map((item) => (
												<Button
													isLarge
													isPrimary={icon_style["colorStyle"] === item.value}
													isSecondary={icon_style["colorStyle"] !== item.value}
													onClick={() => setAttributes({ icon_style: { ...icon_style, colorStyle: item.value } })}
												>
													{item.label}
												</Button>
											))}
										</ButtonGroup>

										{icon_style["colorStyle"] === "normal" && (
											<PanelColorSettings
												className={"rtcl-gb-subpanel-bg"}
												colorSettings={[
													{
														value: icon_style["color"],
														onChange: (color) =>
															setAttributes({
																icon_style: { ...icon_style, color }
															}),
														label: __("Color"),
													}
												]}
											/>
										)}

										{icon_style["colorStyle"] === "hover" && (
											<PanelColorSettings
												className={"rtcl-gb-subpanel-bg"}
												colorSettings={[
													{
														value: icon_style["hvColor"],
														onChange: (hvColor) =>
															setAttributes({
																icon_style: { ...icon_style, hvColor }
															}),
														label: __("Hover Color"),
													}
												]}
											/>
										)}

										<UnitControl
											selectedUnit={icon_style["fsUnit"]}
											unitTypes={[
												{ label: "px", value: "px" },
												{ label: "%", value: "%" },
												{ label: "em", value: "em" },
											]}
											onClick={(fsUnit) => setAttributes({
												icon_style: { ...icon_style, fsUnit }
											})}
										/>

										<RangeControl
											label={__("Icon Size")}
											value={icon_style["fontSize"]}
											onChange={(fontSize) => setAttributes({
												icon_style: { ...icon_style, fontSize }
											})}
											min={0}
											max={TITLE_SIZE_MAX}
											step={TITLE_SIZE_STEP}
										/>

										<UnitControl
											selectedUnit={icon_style["lhUnit"]}
											unitTypes={[
												{ label: "px", value: "px" },
												{ label: "em", value: "em" },
											]}
											onClick={(lhUnit) =>
												setAttributes({ icon_style: { ...icon_style, lhUnit } })
											}
										/>

										<RangeControl
											label={__("Line Height")}
											value={icon_style["lineHeight"]}
											onChange={(lineHeight) =>
												setAttributes({ icon_style: { ...icon_style, lineHeight } })
											}
											min={-1}
											max={TITLE_LINE_HEIGHT_MAX}
											step={TITLE_LINE_HEIGHT_STEP}
										/>


									</PanelBody>

									<PanelBody title={__("Title", "classified-listing")} initialOpen={false} >
										<ButtonGroup className="rtcl-gb-inspector-btn-group">
											{NORMAL_HOVER.map((item) => (
												<Button
													isLarge
													isPrimary={title_style["colorStyle"] === item.value}
													isSecondary={title_style["colorStyle"] !== item.value}
													onClick={() => setAttributes({
														title_style: {
															...title_style, colorStyle: item.value
														}
													})}
												>
													{item.label}
												</Button>
											))}
										</ButtonGroup>

										{title_style["colorStyle"] === "normal" && (
											<PanelColorSettings
												className={"rtcl-gb-subpanel-bg"}
												colorSettings={[
													{
														value: title_style["color"],
														onChange: (color) =>
															setAttributes({
																title_style: { ...title_style, color }
															}),
														label: __("Color"),
													}
												]}
											/>
										)}

										{title_style["colorStyle"] === "hover" && (
											<PanelColorSettings
												className={"rtcl-gb-subpanel-bg"}
												colorSettings={[
													{
														value: title_style["hvColor"],
														onChange: (hvColor) =>
															setAttributes({
																title_style: { ...title_style, hvColor }
															}),
														label: __("Hover Color"),
													}
												]}
											/>
										)}

										<PanelBody title={__("Typography")} initialOpen={false}>
											<BaseControl label={__("Title")} className="rtcl-gb-typography-base">
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

															<UnitControl
																selectedUnit={title_style["fsUnit"]}
																unitTypes={[
																	{ label: "px", value: "px" },
																	{ label: "%", value: "%" },
																	{ label: "em", value: "em" },
																]}
																onClick={(fsUnit) => setAttributes({
																	title_style: { ...title_style, fsUnit }
																})}
															/>

															<RangeControl
																label={__("Font Size")}
																value={title_style["fontSize"]}
																onChange={(fontSize) => setAttributes({
																	title_style: { ...title_style, fontSize }
																})}
																min={0}
																step={TITLE_SIZE_STEP}
																max={TITLE_SIZE_MAX}
															/>

															<SelectControl
																label={__("Font Weight")}
																value={title_style["fontWeight"]}
																options={FONT_WEIGHTS}
																onChange={(fontWeight) =>
																	setAttributes({ title_style: { ...title_style, fontWeight } })
																}
															/>

															<SelectControl
																label={__("Text Transform")}
																value={title_style}
																options={TEXT_TRANSFORM}
																onChange={(textTransform) =>
																	setAttributes({ title_style: { ...title_style, textTransform } })
																}
															/>

															<UnitControl
																selectedUnit={title_style["lsUnit"]}
																unitTypes={[
																	{ label: "px", value: "px" },
																	{ label: "em", value: "em" },
																]}
																onClick={(lsUnit) =>
																	setAttributes({ title_style: { ...title_style, lsUnit } })
																}
															/>

															<RangeControl
																label={__("Letter Spacing")}
																value={title_style["letterSpacing"]}
																onChange={(letterSpacing) =>
																	setAttributes({ title_style: { ...title_style, letterSpacing } })
																}
																min={0}
																max={TITLE_SPACING_MAX}
																step={TITLE_SPACING_STEP}
															/>

															<UnitControl
																selectedUnit={title_style["lhUnit"]}
																unitTypes={[
																	{ label: "px", value: "px" },
																	{ label: "em", value: "em" },
																]}
																onClick={(lhUnit) =>
																	setAttributes({ title_style: { ...title_style, lhUnit } })
																}
															/>

															<RangeControl
																label={__("Line Height")}
																value={title_style["lineHeight"]}
																onChange={(lineHeight) =>
																	setAttributes({ title_style: { ...title_style, lineHeight } })
																}
																min={-1}
																max={TITLE_LINE_HEIGHT_MAX}
																step={TITLE_LINE_HEIGHT_STEP}
															/>
														</div>
													)}
												/>
											</BaseControl>
										</PanelBody>

									</PanelBody>

									<PanelBody title={__("Counter", "classified-listing")} initialOpen={false} >
										<ButtonGroup className="rtcl-gb-inspector-btn-group">
											{NORMAL_HOVER.map((item) => (
												<Button
													isLarge
													isPrimary={counter_style["colorStyle"] === item.value}
													isSecondary={counter_style["colorStyle"] !== item.value}
													onClick={() => setAttributes({ counter_style: { ...counter_style, colorStyle: item.value } })}
												>
													{item.label}
												</Button>
											))}
										</ButtonGroup>

										{counter_style["colorStyle"] === "normal" && (
											<PanelColorSettings
												className={"rtcl-gb-subpanel-bg"}
												colorSettings={[
													{
														value: counter_style["color"],
														onChange: (color) =>
															setAttributes({
																counter_style: { ...counter_style, color }
															}),
														label: __("Color"),
													}
												]}
											/>
										)}

										{counter_style["colorStyle"] === "hover" && (
											<PanelColorSettings
												className={"rtcl-gb-subpanel-bg"}
												colorSettings={[
													{
														value: counter_style["hvColor"],
														onChange: (hvColor) =>
															setAttributes({
																counter_style: { ...counter_style, hvColor }
															}),
														label: __("Hover Color"),
													}
												]}
											/>
										)}

										<UnitControl
											selectedUnit={counter_style["fsUnit"]}
											unitTypes={[
												{ label: "px", value: "px" },
												{ label: "%", value: "%" },
												{ label: "em", value: "em" },
											]}
											onClick={(fsUnit) => setAttributes({
												counter_style: { ...counter_style, fsUnit }
											})}
										/>

										<RangeControl
											label={__("Font Size")}
											value={counter_style["fontSize"]}
											onChange={(fontSize) => setAttributes({
												counter_style: { ...counter_style, fontSize }
											})}
											min={0}
											step={TITLE_SIZE_STEP}
											max={TITLE_SIZE_MAX}
										/>

									</PanelBody>

									{col_style["style"] == "2" && <PanelBody title={__("Sub Category ", "classified-listing")} initialOpen={false} >
										<ButtonGroup className="rtcl-gb-inspector-btn-group">
											{NORMAL_HOVER.map((item) => (
												<Button
													isLarge
													isPrimary={sub_cat_style["colorStyle"] === item.value}
													isSecondary={sub_cat_style["colorStyle"] !== item.value}
													onClick={() => setAttributes({
														sub_cat_style: { ...sub_cat_style, "colorStyle": item.value }
													})}
												>
													{item.label}
												</Button>
											))}
										</ButtonGroup>

										{sub_cat_style["colorStyle"] === "normal" && (
											<PanelColorSettings
												className={"rtcl-gb-subpanel-bg"}
												colorSettings={[
													{
														value: sub_cat_style["color"],
														onChange: (newColor) =>
															setAttributes({
																sub_cat_style: { ...sub_cat_style, "color": newColor }
															}),
														label: __("Color"),
													}
												]}
											/>
										)}

										{sub_cat_style["colorStyle"] === "hover" && (
											<PanelColorSettings
												className={"rtcl-gb-subpanel-bg"}
												colorSettings={[
													{
														value: sub_cat_style["hvColor"],
														onChange: (newColor) =>
															setAttributes({
																sub_cat_style: { ...sub_cat_style, "hvColor": newColor }
															}),
														label: __("Hover Color"),
													}
												]}
											/>
										)}

										<UnitControl
											selectedUnit={sub_cat_padding["unit"]}
											unitTypes={[
												{ label: "px", value: "px" },
												{ label: "em", value: "em" },
												{ label: "%", value: "%" },
											]}
											onClick={(unit) =>
												setAttributes({
													sub_cat_padding: { ...sub_cat_padding, unit }
												})
											}
										/>

										<DimensionsControl
											label={__("Padding", "classified-listing")}
											top={sub_cat_padding["top"]}
											right={sub_cat_padding["right"]}
											bottom={sub_cat_padding["bottom"]}
											left={sub_cat_padding["left"]}
											onChange={({ top, right, bottom, left }) =>
												setAttributes({
													sub_cat_padding: { ...sub_cat_padding, top, bottom, left, right }
												})
											}
										/>

										<PanelColorSettings
											className={"rtcl-gb-subpanel-bg"}
											colorSettings={[
												{
													value: sub_cat_style["iconColor"],
													onChange: (iconColor) =>
														setAttributes({
															sub_cat_style: { ...sub_cat_style, iconColor }
														}),
													label: __("Hover Color"),
												}
											]}
										/>

										<PanelColorSettings
											className={"rtcl-gb-subpanel-bg"}
											colorSettings={[
												{
													value: sub_cat_style["bgColor"],
													onChange: (bgColor) =>
														setAttributes({
															sub_cat_style: { ...sub_cat_style, bgColor }
														}),
													label: __("Hover Color"),
												}
											]}
										/>

										<UnitControl
											selectedUnit={sub_cat_style["fsUnit"]}
											unitTypes={[
												{ label: "px", value: "px" },
												{ label: "%", value: "%" },
												{ label: "em", value: "em" },
											]}
											onClick={(fsUnit) => setAttributes({
												sub_cat_style: { ...sub_cat_style, fsUnit }
											})}
										/>

										<RangeControl
											label={__("Font Size")}
											value={sub_cat_style["fontSize"]}
											onChange={(fontSize) => setAttributes({
												sub_cat_style: { ...sub_cat_style, fontSize }
											})}
											min={0}
											step={TITLE_SIZE_STEP}
											max={TITLE_SIZE_MAX}
										/>
									</PanelBody>}

									<PanelBody title={__("Content", "classified-listing")} initialOpen={false} >


										{content_visibility["catDesc"] &&
											<>
												<ButtonGroup className="rtcl-gb-inspector-btn-group">
													{NORMAL_HOVER.map((item) => (
														<Button
															isLarge
															isPrimary={content_style["colorStyle"] === item.value}
															isSecondary={content_style["colorStyle"] !== item.value}
															onClick={() => setAttributes({
																content_style: { ...content_style, "colorStyle": item.value }
															})}
														>
															{item.label}
														</Button>
													))}
												</ButtonGroup>

												{content_style["colorStyle"] === "normal" && (
													<PanelColorSettings
														className={"rtcl-gb-subpanel-bg"}
														colorSettings={[
															{
																value: content_style["color"],
																onChange: (newColor) =>
																	setAttributes({
																		content_style: { ...content_style, "color": newColor }
																	}),
																label: __("Color"),
															}
														]}
													/>
												)}

												{content_style["colorStyle"] === "hover" && (
													<PanelColorSettings
														className={"rtcl-gb-subpanel-bg"}
														colorSettings={[
															{
																value: content_style["hvColor"],
																onChange: (newColor) =>
																	setAttributes({
																		content_style: { ...content_style, "hvColor": newColor }
																	}),
																label: __("Hover Color"),
															}
														]}
													/>
												)}

											</>
										}


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

														<UnitControl
															selectedUnit={content_style["fsUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "%", value: "%" },
																{ label: "em", value: "em" },
															]}
															onClick={(fsUnit) => setAttributes({
																content_style: { ...content_style, fsUnit }
															})}
														/>

														<RangeControl
															label={__("Font Size")}
															value={content_style["fontSize"]}
															onChange={(fontSize) => setAttributes({
																content_style: { ...content_style, fontSize }
															})}
															min={0}
															step={TITLE_SIZE_STEP}
															max={TITLE_SIZE_MAX}
														/>

														<SelectControl
															label={__("Font Weight")}
															value={content_style["fontWeight"]}
															options={FONT_WEIGHTS}
															onChange={(fontWeight) =>
																setAttributes({ content_style: { ...content_style, fontWeight } })
															}
														/>

														<SelectControl
															label={__("Text Transform")}
															value={content_style}
															options={TEXT_TRANSFORM}
															onChange={(textTransform) =>
																setAttributes({ content_style: { ...content_style, textTransform } })
															}
														/>

														<UnitControl
															selectedUnit={content_style["lsUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "em", value: "em" },
															]}
															onClick={(lsUnit) =>
																setAttributes({ content_style: { ...content_style, lsUnit } })
															}
														/>

														<RangeControl
															label={__("Letter Spacing")}
															value={content_style["letterSpacing"]}
															onChange={(letterSpacing) =>
																setAttributes({ content_style: { ...content_style, letterSpacing } })
															}
															min={0}
															max={TITLE_SPACING_MAX}
															step={TITLE_SPACING_STEP}
														/>

														<UnitControl
															selectedUnit={content_style["lhUnit"]}
															unitTypes={[
																{ label: "px", value: "px" },
																{ label: "em", value: "em" },
															]}
															onClick={(lhUnit) =>
																setAttributes({ content_style: { ...content_style, lhUnit } })
															}
														/>

														<RangeControl
															label={__("Line Height")}
															value={content_style["lineHeight"]}
															onChange={(lineHeight) =>
																setAttributes({ content_style: { ...content_style, lineHeight } })
															}
															min={-1}
															max={TITLE_LINE_HEIGHT_MAX}
															step={TITLE_LINE_HEIGHT_STEP}
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
										<UnitControl
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
											label={__("Main Wrapper Paddign", "classified-listing")}
											top={container_padding["top"]}
											right={container_padding["right"]}
											bottom={container_padding["bottom"]}
											left={container_padding["left"]}
											onChange={({ top, right, bottom, left }) => setAttributes({
												container_padding: { ...container_padding, top, bottom, left, right },
											})
											}
										/>
										<UnitControl
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
													container_style: { ...container_style, "bgColor": newColor }
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