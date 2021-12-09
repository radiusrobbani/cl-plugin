import styled from 'styled-components';

export const BoxContainer = styled.div`
	${props => (props.css["gutterSpace"]) ? "gap:" + props.css["gutterSpace"] + props.css["gsUnit"] + "!important" : ''}
`
export const IconContainer = styled.div`
	.rtcl-icon:before {
		${props => props.css["color"] ? "color:" + props.css["color"] + "!important" : ''};
		${props => props.css["fontSize"] ? "font-size:" + props.css["fontSize"] + props.css["fsUnit"] + "!important" : ''};
		${props => props.css["lineHeight"] ? "line-height:" + props.css["lineHeight"] + props.css["lhUnit"] + "!important" : ''};
	}
	img{
		${props => props.css["fontSize"] ? "width:" + props.css["fontSize"] + props.css["fsUnit"] + "!important" : ''};
		${props => props.css["fontSize"] ? "height:" + props.css["fontSize"] + props.css["fsUnit"] + "!important" : ''};
	}
`

export const BoxItemContainer2 = styled.div`
	${props => props.css["borderWidth"] ? "border-width:" + props.css["borderWidth"] + "!important" : ''};
	${props => props.css["borderWidth"] && props.css["borderStyle"] ? "border-style:" + props.css["borderStyle"] + "!important" : ''};
	${props => props.css["borderColor"] ? "border-color:" + props.css["borderColor"] + "!important" : ''};
	${props => props.css["borderRadius"] ? "border-radius:" + props.css["borderRadius"] + "!important" : ''};
	.rtcl-parent-cat{
		${props => props.css["bgColor"] ? "background-color:" + props.css["bgColor"] + "!important" : ''};
		${props => props.css_pad.bottom ? "padding-bottom:" + props.css_pad.bottom + props.css_pad.unit + "!important" : ''};
		${props => props.css_pad.top ? "padding-top:" + props.css_pad.top + props.css_pad.unit + "!important" : ''};
		${props => props.css_pad.left ? "padding-left:" + props.css_pad.left + props.css_pad.unit + "!important" : ''};
		${props => props.css_pad.right ? "padding-right:" + props.css_pad.right + props.css_pad.unit + "!important" : ''};

		${props => props.css["borderWidth"] ? "border-bottom-width:" + props.css["borderWidth"] + "!important" : ''};
		${props => props.css["borderWidth"] && props.css["borderStyle"] ? "border-bottom-style:" + props.css["borderStyle"] + "!important" : ''};
		${props => props.css["borderColor"] ? "border-bottom-color:" + props.css["borderColor"] + "!important" : ''};

		&:hover{
			${props => props.css["hvBGColor"] ? "background-color:" + props.css["hvBGColor"] + "!important" : ''};
			.title{
				${props => props.css_title["hvColor"] ? "color:" + props.css_title["hvColor"] + "!important" : ''};
			}
			.counter{
				${props => props.css_counter["hvColor"] ? "color:" + props.css_counter["hvColor"] + "!important" : ''};
			}
			.rtcl-icon:before {
				${props => props.css_icon["hvColor"] ? "color:" + props.css_icon["hvColor"] + "!important" : ''};
			}
		}
	}
`
export const BoxItemContainer1 = styled.a`
	${props => props.css_pad.bottom ? "padding-bottom:" + props.css_pad.bottom + props.css_pad.unit + "!important" : ''};
	${props => props.css_pad.top ? "padding-top:" + props.css_pad.top + props.css_pad.unit + "!important" : ''};
	${props => props.css_pad.left ? "padding-left:" + props.css_pad.left + props.css_pad.unit + "!important" : ''};
	${props => props.css_pad.right ? "padding-right:" + props.css_pad.right + props.css_pad.unit + "!important" : ''};

	${props => props.css["bgColor"] ? "background-color:" + props.css["bgColor"] + "!important" : ''};

	${props => props.css["borderWidth"] ? "border-width:" + props.css["borderWidth"] + "!important" : ''};
	${props => props.css["borderWidth"] && props.css["borderStyle"] ? "border-style:" + props.css["borderStyle"] + "!important" : ''};
	${props => props.css["borderColor"] ? "border-color:" + props.css["borderColor"] + "!important" : ''};
	${props => props.css["borderRadius"] ? "border-radius:" + props.css["borderRadius"] + "!important" : ''};
	&:hover{
		${props => props.css["hvBGColor"] ? "background-color:" + props.css["hvBGColor"] + "!important" : ''};
		.title{
			${props => props.css_title["hvColor"] ? "color:" + props.css_title["hvColor"] + "!important" : ''};
		}
		.counter{
			${props => props.css_counter["hvColor"] ? "color:" + props.css_counter["hvColor"] + "!important" : ''};
		}
		.rtcl-icon:before {
		${props => props.css_icon["hvColor"] ? "color:" + props.css_icon["hvColor"] + "!important" : ''};
		}
		.content{
			${props => props.css_content["hvColor"] ? "color:" + props.css_content["hvColor"] + "!important" : ''};
		}
	}
`

export const BoxItemContainer3 = styled.div`
	${props => props.css_pad.bottom ? "padding-bottom:" + props.css_pad.bottom + props.css_pad.unit + "!important" : ''};
	${props => props.css_pad.top ? "padding-top:" + props.css_pad.top + props.css_pad.unit + "!important" : ''};
	${props => props.css_pad.left ? "padding-left:" + props.css_pad.left + props.css_pad.unit + "!important" : ''};
	${props => props.css_pad.right ? "padding-right:" + props.css_pad.right + props.css_pad.unit + "!important" : ''};

	${props => props.css["bgColor"] ? "background-color:" + props.css["bgColor"] + "!important" : ''};
	${props => props.css["borderWidth"] ? "border-width:" + props.css["borderWidth"] + "!important" : ''};
	${props => props.css["borderWidth"] && props.css["borderStyle"] ? "border-style:" + props.css["borderStyle"] + "!important" : ''};
	${props => props.css["borderColor"] ? "border-color:" + props.css["borderColor"] + "!important" : ''};
	${props => props.css["borderRadius"] ? "border-radius:" + props.css["borderRadius"] + "!important" : ''};

	.title{
		a{
			${props => props.css_title["color"] ? "color:" + props.css_title["color"] + "!important" : ''};
			&:hover{
				${props => props.css_title["hvColor"] ? "color:" + props.css_title["hvColor"] + "!important" : ''};
			}
		}
	}
	.counter{
		&:hover{
			${props => props.css_counter["hvColor"] ? "color:" + props.css_counter["hvColor"] + "!important" : ''};
		}
	}
	.content{
		&:hover{
			${props => props.css_content["hvColor"] ? "color:" + props.css_content["hvColor"] + "!important" : ''};
		}
	}
	.rtin-icon{
		&:hover{
			.rtcl-icon:before {
				${props => props.css_icon["hvColor"] ? "color:" + props.css_icon["hvColor"] + "!important" : ''};
			}
		}
	}

`
