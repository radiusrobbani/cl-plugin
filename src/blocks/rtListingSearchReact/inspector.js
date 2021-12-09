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
import UnitControl12 from "../../util/unit-control";
import {
	NORMAL_HOVER,
	TEXT_ALIGN,
	FONT_WEIGHTS,
	TEXT_TRANSFORM,
	STYLE_OPTIONS,
	COLORS,

} from "./constants";


function Inspector(props) {
	const { attributes, setAttributes } = props;
	const {
		style
	} = attributes;


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
											label={__('Style', 'classified-listing')}
											options={STYLE_OPTIONS}
											value={style}
											onChange={(style) => setAttributes({ style })}
										/>
									</PanelBody>
								</>
							)}

							{tab.name === "styles" && (
								<>
									<h1>style</h1>
								</>
							)}

							{tab.name === "advance" && (
								<>
									<h1>advance</h1>
								</>
							)}

						</div>
					)}
				</TabPanel>
			</div>
		</InspectorControls >
	)

}

export default Inspector;