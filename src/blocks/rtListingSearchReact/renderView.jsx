import StyleInline from "./layout/style-inline";
import StyleVartical from "./layout/style-vartical";

function RenderView(props) {
	const { style } = props;

	return (
		<>
			{style == "1" && <StyleInline />}
			{style == "2" && <StyleVartical />}
		</>
	)
}

export default RenderView;