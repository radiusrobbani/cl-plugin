import styled from 'styled-components';


export const UL = styled.ul`
	${({ css: { bgColor } }) => bgColor ? "background-color:" + bgColor + "!important" : ''};
	${props => props.css_pad.bottom ? "padding-bottom:" + props.css_pad.bottom + props.css_pad.unit + "!important" : ''};
	${props => props.css_pad.top ? "padding-top:" + props.css_pad.top + props.css_pad.unit + "!important" : ''};
	${props => props.css_pad.left ? "padding-left:" + props.css_pad.left + props.css_pad.unit + "!important" : ''};
	${props => props.css_pad.right ? "padding-right:" + props.css_pad.right + props.css_pad.unit + "!important" : ''};
 li{
	 a{
		${props => props.css["color"] ? "color:" + props.css["color"] + "!important" : ''};
	 	${props => props.css["fontSize"] ? "font-size:" + props.css["fontSize"] + props.css["fsUnit"] + "!important" : ''};
		 &:hover{
			${({ css: { hvColor } }) => hvColor ? "color:" + hvColor + "!important" : ''};
		 }
	 }
 }
 .rtcl-icon{
		${props => props.css["iconColor"] ? "color:" + props.css["iconColor"] + "!important" : ''};
		${props => props.css["fontSize"] ? "font-size:" + props.css["fontSize"] + props.css["fsUnit"] + "!important" : ''};
	}
`
export const H3 = styled.h3`
  ${props => props.css["color"] ? "color:" + props.css["color"] + "!important" : ''};
	${props => props.css["fontSize"] ? "font-size:" + props.css["fontSize"] + props.css["fsUnit"] + "!important" : ''};
	${props => props.css["fontWeight"] ? "font-weight:" + props.css["fontWeight"] + "!important" : ''};
	${props => props.css["lineHeight"] ? "line-height:" + props.css["lineHeight"] + props.css["lhUnit"] + "!important" : ''};
	${props => props.css["textTransform"] ? "text-transform:" + props.css["textTransform"] + "!important" : ''};
	${props => props.css["letterSpacing"] ? "letter-spacing:" + props.css["letterSpacing"] + props.css["lsUnit"] + "!important" : ''};
`

export const Counter = styled.div`
  ${props => props.css["color"] ? "color:" + props.css["color"] + "!important" : ''};
	${({ css: { fontSize, fsUnit } }) => fontSize ? 'font-size:' + fontSize + fsUnit + "!important" : ''};
`
export const Content = styled.div`
	${props => props.css["color"] ? "color:" + props.css["color"] + "!important" : ''};
	${props => props.css["fontSize"] ? "font-size:" + props.css["fontSize"] + props.css["fsUnit"] + "!important" : ''};
	${props => props.css["fontWeight"] ? "font-weight:" + props.css["fontWeight"] + "!important" : ''};
	${props => props.css["lineHeight"] ? "line-height:" + props.css["lineHeight"] + props.css["lhUnit"] + "!important" : ''};
	${props => props.css["textTransform"] ? "text-transform:" + props.css["textTransform"] + "!important" : ''};
	${props => props.css["letterSpacing"] ? "letter-spacing:" + props.css["letterSpacing"] + props.css["lsUnit"] + "!important" : ''};
`

