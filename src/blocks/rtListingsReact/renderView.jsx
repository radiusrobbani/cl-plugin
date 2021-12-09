import StyleGrid from "./layout/grid/style-grid";
import StyleGrid2 from "./layout/grid/style-grid2";
import StyleGrid3 from "./layout/grid/style-grid3";
import StyleGrid4 from "./layout/grid/style-grid4";
import StyleGrid5 from "./layout/grid/style-grid5";
import StyleList from "./layout/list/style-list";
import StyleList2 from "./layout/list/style-list2";
import StyleList3 from "./layout/list/style-list3";
import StyleList4 from "./layout/list/style-list4";
import StyleList5 from "./layout/list/style-list5";

function RenderView(props) {
	const { data, col_style } = props;

	return (
		<>
			{(col_style['style'] == 'grid' && col_style['style_grid'] == '1') ? (<StyleGrid {...props} data={data} />) : ""}
			{(col_style['style'] == 'grid' && col_style['style_grid'] == '2') ? (<StyleGrid2 {...props} data={data} />) : ""}
			{(col_style['style'] == 'grid' && col_style['style_grid'] == '3') ? (<StyleGrid3 {...props} data={data} />) : ""}
			{(col_style['style'] == 'grid' && col_style['style_grid'] == '4') ? (<StyleGrid4 {...props} data={data} />) : ""}
			{(col_style['style'] == 'grid' && col_style['style_grid'] == '5') ? (<StyleGrid5 {...props} data={data} />) : ""}

			{(col_style['style'] == 'list' && col_style['style_list'] == '1') ? (<StyleList {...props} data={data} />) : ''}
			{(col_style['style'] == 'list' && col_style['style_list'] == '2') ? (<StyleList2 {...props} data={data} />) : ''}
			{(col_style['style'] == 'list' && col_style['style_list'] == '3') ? (<StyleList3 {...props} data={data} />) : ''}
			{(col_style['style'] == 'list' && col_style['style_list'] == '4') ? (<StyleList4 {...props} data={data} />) : ''}
			{(col_style['style'] == 'list' && col_style['style_list'] == '5') ? (<StyleList5 {...props} data={data} />) : ''}
		</>
	)
}

export default RenderView;