import styled from 'styled-components';



export const TitleaA = styled.a`
	color: ${props => props.css.color} !important;
	&:hover{
		color: ${props => props.css.h_color} !important;
	}
`;

export const TitleTag = styled.div`
	text-align: ${props => props.css['text-align']} !important;
`;

//container wrapper
export const ContainerWrap = styled.div`
	${props => props.css_mar.bottom ? "margin-bottom:" + props.css_mar.bottom + props.css_mar.unit : ''};
	${props => props.css_mar.top ? "margin-top:" + props.css_mar.top + props.css_mar.unit : ''};
	${props => props.css_mar.left ? "margin-left:" + props.css_mar.left + props.css_mar.unit : ''};
	${props => props.css_mar.right ? "margin-right:" + props.css_mar.right + props.css_mar.unit : ''};
	${props => props.css_pad.bottom ? "padding-bottom:" + props.css_pad.bottom + props.css_pad.unit + "!important" : ''};
	${props => props.css_pad.top ? "padding-top:" + props.css_pad.top + props.css_pad.unit + "!important" : ''};
	${props => props.css_pad.left ? "padding-left:" + props.css_pad.left + props.css_pad.unit + "!important" : ''};
	${props => props.css_pad.right ? "padding-right:" + props.css_pad.right + props.css_pad.unit + "!important" : ''};
	${props => props.css["bgColor"] ? "background-color:" + props.css["bgColor"] : ''};
`


