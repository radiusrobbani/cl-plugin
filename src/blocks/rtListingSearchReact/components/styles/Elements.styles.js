import styled from 'styled-components';



export const H3 = styled.h3`
	& a {
		${props => props.css["color"] ? "color:" + props.css["color"] + "!important" : ''};
		:hover{
			${props => props.css["hvColor"] ? "color:" + props.css["hvColor"] + "!important" : ''};
		}
	}

	${props => props.css["fontSize"] ? "font-size:" + props.css["fontSize"] + props.css["fsUnit"] + "!important" : ''};
	${props => props.css["fontWeight"] ? "font-weight:" + props.css["fontWeight"] + "!important" : ''};
	${props => props.css["lineHeight"] ? "line-height:" + props.css["lineHeight"] + props.css["lhUnit"] + "!important" : ''};
	${props => props.css["textTransform"] ? "text-transform:" + props.css["textTransform"] + "!important" : ''};
	${props => props.css["letterSpacing"] ? "letter-spacing:" + props.css["letterSpacing"] + props.css["lsUnit"] + "!important" : ''};

`

export const UL = styled.ul`
  li{
	${props => props.css["color"] ? "color:" + props.css["color"] + "!important" : ''};
	${props => props.css["fontSize"] ? "font-size:" + props.css["fontSize"] + props.css["fsUnit"] + "!important" : ''};
	${props => props.css["fontWeight"] ? "font-weight:" + props.css["fontWeight"] + "!important" : ''};
	${props => props.css["lineHeight"] ? "line-height:" + props.css["lineHeight"] + props.css["lhUnit"] + "!important" : ''};
	${props => props.css["textTransform"] ? "text-transform:" + props.css["textTransform"] + "!important" : ''};
	${props => props.css["letterSpacing"] ? "letter-spacing:" + props.css["letterSpacing"] + props.css["lsUnit"] + "!important" : ''};
	}
 .rtcl-icon{
		${props => props.css["iconColor"] ? "color:" + props.css["iconColor"] + "!important" : ''};
	}

`

export const Content = styled.p`
	${props => props.css["color"] ? "color:" + props.css["color"] + "!important" : ''};
	${props => props.css["fontSize"] ? "font-size:" + props.css["fontSize"] + props.css["fsUnit"] + "!important" : ''};
	${props => props.css["fontWeight"] ? "font-weight:" + props.css["fontWeight"] + "!important" : ''};
	${props => props.css["lineHeight"] ? "line-height:" + props.css["lineHeight"] + props.css["lhUnit"] + "!important" : ''};
	${props => props.css["textTransform"] ? "text-transform:" + props.css["textTransform"] + "!important" : ''};
	${props => props.css["letterSpacing"] ? "letter-spacing:" + props.css["letterSpacing"] + props.css["lsUnit"] + "!important" : ''};
`;



