import styled from 'styled-components';

export const ListingItemContainer = styled.div`

	${props => (props.css["gutterSpace"] && props.css["style"] == "list") ? "margin-bottom:" + props.css["gutterSpace"] + props.css["gsUnit"] + "!important" : ''};
	${props => props.css_pad.bottom ? "padding-bottom:" + props.css_pad.bottom + props.css_pad.unit + "!important" : ''};
	${props => props.css_pad.top ? "padding-top:" + props.css_pad.top + props.css_pad.unit + "!important" : ''};
	${props => props.css_pad.left ? "padding-left:" + props.css_pad.left + props.css_pad.unit + "!important" : ''};
	${props => props.css_pad.right ? "padding-right:" + props.css_pad.right + props.css_pad.unit + "!important" : ''};

	${props => props.css["bg-color"] ? "background-color:" + props.css["bg-color"] + "!important" : ''};

	${props => props.css["border-width"] ? "border-width:" + props.css["border-width"] + "!important" : ''};
	${props => props.css["border-width"] && props.css["border-style"] ? "border-style:" + props.css["border-style"] + "!important" : ''};
	${props => props.css["border-color"] ? "border-color:" + props.css["border-color"] + "!important" : ''};
	${props => props.css["border-radius"] ? "border-radius:" + props.css["border-radius"] + "!important" : ''};

	&.listing-item.is-featured {
		${props => props.css["featuredBGColor"] ? "background-color:" + props.css["featuredBGColor"] + "!important" : ''};
		${props => props.css["featuredBDColor"] ? "border:" + "1px solid " + props.css["featuredBDColor"] + "!important" : ''};
	}


`

export const PriceButtonContainer = styled.div`
  & .rtcl-price-amount {
		-webkit-transition: all 0.5s ease-out;
		transition: all 0.5s ease-out;
    background-color: #0066bf!important;
    border-color: #0066bf;
		&:before {
			-webkit-transition: all 0.5s ease-out;
			transition: all 0.5s ease-out;
    	border-right-color: #0066bf!important;
		}
	}
	& .rtcl-price-amount {
		${props => props.css["bgColor"] ? "background-color:" + props.css["bgColor"] + "!important" : ''};
		${props => props.css["bgColor"] ? "border-color:" + props.css["bgColor"] + "!important" : ''};
		${props => props.css["color"] ? "color:" + props.css["color"] + "!important" : ''};
		&:before {
			${props => props.css["bgColor"] ? "	border-right-color:" + props.css["bgColor"] + "!important" : ''};
		}
		&:hover{
			${props => props.css["hvBGColor"] ? "background-color:" + props.css["hvBGColor"] + "!important" : ''};
			${props => props.css["hvBGColor"] ? "border-color:" + props.css["hvBGColor"] + "!important" : ''};
			${props => props.css["hvColor"] ? "color:" + props.css["hvColor"] + "!important" : ''};
			&:before{
				${props => props.css["hvBGColor"] ? "	border-right-color:" + props.css["hvBGColor"] + "!important" : ''};
			}
		}
	}

`
export const ListingContainer = styled.div`
	${props => (props.css["gutterSpace"] && props.css['style'] == "grid") ? "gap:" + props.css["gutterSpace"] + props.css["gsUnit"] + "!important" : ''}
`

export const BadgeContainer = styled.span`
  .badge.rtcl-badge-featured {
		${props => props.css["badgeBGColor"] ? "background-color:" + props.css["badgeBGColor"] + "!important" : ''};
		${props => props.css["badgeColor"] ? "color:" + props.css["badgeColor"] + "!important" : ''};
	}
`
export const ButtonContainer = styled.div`
	a {
		${props => props.css["bgColor"] ? "background-color:" + props.css["bgColor"] + "!important" : ''};
		${props => props.css["color"] ? "color:" + props.css["color"] + "!important" : ''};
		.rtcl-icon{
			${props => props.css["color"] ? "color:" + props.css["color"] + "!important" : ''};
		}
		&:hover{
			${props => props.css["hvColor"] ? "color:" + props.css["hvColor"] + "!important" : ''};
			${props => props.css["hvBGColor"] ? "background-color:" + props.css["hvBGColor"] + "!important" : ''};
			.rtcl-icon{
				${props => props.css["hvColor"] ? "color:" + props.css["hvColor"] + "!important" : ''};
			}
		}
	}
`;

export const IconBtnContainer = styled.div`
	${props => props.css["bgColor"] ? "background-color:" + props.css["bgColor"] + "!important" : ''};
	${props => props.css["color"] ? "color:" + props.css["color"] + "!important" : ''};
	.rtcl-icon{
		${props => props.css["color"] ? "color:" + props.css["color"] + "!important" : ''};
	}
	&:hover{
		${props => props.css["hvColor"] ? "color:" + props.css["hvColor"] + "!important" : ''};
		${props => props.css["hvBGColor"] ? "background-color:" + props.css["hvBGColor"] + "!important" : ''};
		.rtcl-icon{
			${props => props.css["hvColor"] ? "color:" + props.css["hvColor"] + "!important" : ''};
		}
	}
`;

export const PriceContainer = styled.div`
	.rtcl-price-amount{
		${props => props.css["bgColor"] ? "background-color:" + props.css["bgColor"] + "!important" : ''};
		${props => props.css["color"] ? "color:" + props.css["color"] + "!important" : ''};
		${props => props.css["fontSize"] ? "font-size:" + props.css["fontSize"] + props.css["fsUnit"] + "!important" : ''};
		${props => props.css["fontWeight"] ? "font-weight:" + props.css["fontWeight"] + "!important" : ''};
	}
	.rtcl-price-meta {
		${props => props.css["unitLabelColor"] ? "color:" + props.css["unitLabelColor"] + "!important" : ''};
		${props => props.css["unitLFSize"] ? "font-size:" + props.css["unitLFSize"] + props.css["unitLFSizeUnit"] + "!important" : ''};
		${props => props.css["unitLFSizeWeight"] ? "font-weight:" + props.css["unitLFSizeWeight"] + "!important" : ''};
	}
`

export const PriceContainer2 = styled.div`
	${props => props.css["bgColor"] ? "background-color:" + props.css["bgColor"] + "!important" : ''};
	.rtcl-price-amount{
		${props => props.css["color"] ? "color:" + props.css["color"] + "!important" : ''};
		${props => props.css["fontSize"] ? "font-size:" + props.css["fontSize"] + props.css["fsUnit"] + "!important" : ''};
		${props => props.css["fontWeight"] ? "font-weight:" + props.css["fontWeight"] + "!important" : ''};
	}
	.rtcl-price-meta {
		${props => props.css["unitLabelColor"] ? "color:" + props.css["unitLabelColor"] + "!important" : ''};
		${props => props.css["unitLFSize"] ? "font-size:" + props.css["unitLFSize"] + props.css["unitLFSizeUnit"] + "!important" : ''};
		${props => props.css["unitLFSizeWeight"] ? "font-weight:" + props.css["unitLFSizeWeight"] + "!important" : ''};
	}
`
