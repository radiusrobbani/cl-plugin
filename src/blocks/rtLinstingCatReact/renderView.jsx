import { ContainerWrap } from "../../util/style-components";
import StyleGrid from "./layout/style-grid";
import StyleGrid2 from "./layout/style-grid2";
import StyleGrid3 from "./layout/style-grid3";

function RenderView(props) {
	const {
		container_padding,
		container_margin,
		container_style,
		col_style,
		data,
	} = props;

	return (
		<ContainerWrap css={container_style} css_mar={container_margin} css_pad={container_padding}>
			{col_style["style"] == '1' && <StyleGrid {...props} data={data} />}
			{col_style["style"] == '2' && <StyleGrid2 {...props} data={data} />}
			{col_style["style"] == '3' && <StyleGrid3 {...props} data={data} />}
		</ContainerWrap>
	)
}

export default RenderView;