import React from "react";
import PropTypes from "prop-types";
import "./style.scss";

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { ButtonGroup, Button } = wp.components;

const UnitControl = ({ selectedUnit, unitTypes, onClick }) => (
	<ButtonGroup className="rtcl-gb-unit-control-btn-group">
		{unitTypes.map(unit => (
			<Button
				className={`rtcl-gb-unit-control-btn ${unit.value === selectedUnit &&
					"rtcl-gb-unit-active"}`}
				isSmall
				isPrimary={unit.value === selectedUnit}
				onClick={() => onClick(unit.value)}
			>
				{unit.label}
			</Button>
		))}
	</ButtonGroup>
);

UnitControl.propTypes = {
	selectedUnit: PropTypes.string.isRequired,
	unitTypes: PropTypes.shape({
		label: PropTypes.string,
		value: PropTypes.string
	}),
	onClick: PropTypes.func.isRequired
};

export default UnitControl;
