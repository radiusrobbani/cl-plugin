const { __ } = wp.i18n;
import classnames from 'classnames';
import { ContainerWrap } from "../../../../util/style-components";
import { BadgeContainer, ListingContainer, ListingItemContainer, PriceContainer, SoldContainer, ItemContentContainer } from '../../components/styles/Container.styles';
import { Content, H3, UL } from '../../components/styles/Elements.styles';

function StyleGrid(props) {

	const {
		block_id,
		col_style,
		col_padding,
		title_style,
		meta_style,
		content_style,
		content_margin,
		price_style,
		container_padding,
		container_margin,
		container_style,
		content_visibility,
		content_limit,
		col_desktop,
		col_tablet,
		col_mobile,
		badge_style,
		sold_style,
		data,
		content_padding,
		promotion_style
	} = props;

	const gridContainerClassNames = classnames([
		'rtcl-grid-view',
		'columns-' + col_desktop,
		'tab-columns-' + col_tablet,
		'mobile-columns-' + col_mobile,
		'rtcl-gb-grid-view',
		'rtcl-gb-grid-style-' + col_style['style_grid']

	]);

	const itemContainerClassNames = classnames([
		content_visibility["thumb_position"] === "left" ? "rtcl-flex" : ""
	])

	return [
		<style>{`
		#rtcl-gb-${block_id} {
		}
		`}</style>,
		data.length ? (
			<ContainerWrap id={'rtcl-gb-' + block_id} css={container_style} css_mar={container_margin} css_pad={container_padding} className="rtcl">
				<ListingContainer css={col_style} className={gridContainerClassNames} >

					{data.map(listing => (
						<ListingItemContainer css={col_style} css_pad={col_padding} css_pm={promotion_style} className={[Object.values(listing.classes).join(" "), itemContainerClassNames]}>

							{(content_visibility["thumbnail"] && listing.thumbnail) ? (
								<div className="listing-thumb">
									<a href={listing.post_link} className="rtcl-media" dangerouslySetInnerHTML={{ __html: listing.thumbnail }}></a>
									{content_visibility["sold"] && listing.sold ? <SoldContainer css={sold_style} dangerouslySetInnerHTML={{ __html: listing.sold }}></SoldContainer> : ''}
								</div>
							) : ''}

							<ItemContentContainer css_pad={content_padding} className="item-content">

								{(content_visibility["price"] && listing.price) ? (
									<PriceContainer css={price_style} className="item-price listing-price" dangerouslySetInnerHTML={{ __html: listing.price }}></PriceContainer>
								) : ''}

								{(content_visibility["category"] && listing.categories) ? (
									<div className='listing-cat' dangerouslySetInnerHTML={{ __html: listing.categories }}></div>
								) : ''}

								{(content_visibility["title"] && listing.title) ? (
									<H3 css={title_style} className="listing-title"><a href={listing.post_link}>{listing.title}</a></H3>
								) : ''}

								{(content_visibility["badge"] && listing.badges) ? (
									<BadgeContainer css={badge_style} className="listing-badge-wrap" dangerouslySetInnerHTML={{ __html: listing.badges }}></BadgeContainer>
								) : ''}

								<UL css={meta_style} className="rtcl-listing-meta-data">
									{(content_visibility["date"] && listing.time) ? (
										<li className="updated"><i className="rtcl-icon rtcl-icon-clock"></i>{listing.time}</li>
									) : ''}
									{(content_visibility["author"] && listing.author) ? (
										<li className="author"><i className="rtcl-icon rtcl-icon-user"></i>{listing.author}</li>
									) : ''}
									{(content_visibility["location"] && listing.locations) ? (
										<li className="rt-location"><i className="rtcl-icon rtcl-icon-location"></i>{listing.locations}</li>
									) : ''}
									{(content_visibility["view"] && listing.views) ? (
										<li className="rt-views"><i className="rtcl-icon rtcl-icon-eye"></i>{listing.views} {__("views", "classified_listing")}</li>
									) : ''}

								</UL>

								{(content_visibility["grid_content"] && listing.excerpt) ? (
									<Content className="rtcl-excerpt" css={content_style} css_mar={content_margin} dangerouslySetInnerHTML={{ __html: listing.excerpt.split(' ', content_limit).join(' ') }}></Content>
								) : ''}

							</ItemContentContainer>

						</ListingItemContainer>
					))}

				</ListingContainer>
			</ContainerWrap>
		) : '',
	]
}

export default StyleGrid;
