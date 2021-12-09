import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { BoxContainer, IconContainer, BoxItemContainer1 } from './components/Container.style';
import { H3, Counter, Content } from './components/Element.style';
function StyleGrid(props) {

	const {
		client_id,
		content_limit,
		icon_type,
		col_desktop,
		col_tablet,
		col_mobile,

		col_style,
		content_visibility,
		content_style,
		counter_style,
		title_style,
		icon_style,
		col_padding,

		data,
	} = props;

	const colClasses = classnames([
		'rtcl-grid-view',
		'columns-' + col_desktop,
		'tab-columns-' + col_tablet,
		'mobile-columns-' + col_mobile,
		'rtcl-gb-cat-wrap'
	]);

	return [

		data.length ? (
			<div id={'rtcl-gb-' + client_id} className="rtcl">
				<BoxContainer css={col_style} className={colClasses}>

					{data.map(catlist => (
						<div key={catlist.name} className="listing-item rtcl-gb-cat-box">
							<BoxItemContainer1 css={col_style} css_pad={col_padding} css_title={title_style} css_counter={counter_style} css_icon={icon_style} css_content={content_style} href={catlist.permalink}>

								{content_visibility["icon"] && catlist.icon_html ?
									<IconContainer css={icon_style} className={icon_type == 'icon' ? 'item-icon' : 'item-image'} dangerouslySetInnerHTML={{ __html: catlist.icon_html }}></IconContainer> : ''}

								<div className="item-content">
									<H3 css={title_style} className="title" dangerouslySetInnerHTML={{ __html: catlist.name }}></H3>
									{content_visibility["counter"] ? <Counter css={counter_style} className="counter">{catlist.count + __(' Ad')}</Counter> : ''}
									{content_visibility["catDesc"] && catlist.description ? <Content css={content_style} className="content">{`${catlist.description.split(' ', content_limit).join(' ')}`}</Content> : ''}
								</div>
							</BoxItemContainer1>
						</div>
					))}
				</BoxContainer>
			</div>
		) : '',

	]

}
export default StyleGrid;