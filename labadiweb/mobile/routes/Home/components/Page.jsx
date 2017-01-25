import { timeAgo } from '#lib/date';
import Icon from '#common/components/Icon';
var React = require('#node_modules/react');
var ReactCanvas = require('#node_modules/react-canvas');

var Group = ReactCanvas.Group;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var FontFace = ReactCanvas.FontFace;
var measureText = ReactCanvas.measureText;

var FONT_FACE_DEFAULT = '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif';
var CONTENT_INSET = 14;
var TEXT_SCROLL_SPEED_MULTIPLIER = 0.6;
var TEXT_ALPHA_SPEED_OUT_MULTIPLIER = 1.5;
var TEXT_ALPHA_SPEED_IN_MULTIPLIER = 2.6;
var IMAGE_LAYER_INDEX = 2;
var TEXT_LAYER_INDEX = 1;
var BOTTOM_BAR_HEIGHT = 32;

ReactCanvas.registerLayerType('Button', function (ctx, layer) {
  var xPos = layer._originalStyle.left || 0;
  let yPos = layer._originalStyle.top || 0;
  let background = layer._originalStyle.background || 'rgb(0, 0, 0)';
  let color = layer._originalStyle.color || 'rgb(0, 0, 0)';
  let width = layer._originalStyle.width;
  let height = layer._originalStyle.height;
  let fontSize = layer._originalStyle.fontSize;
  let font = layer._originalStyle.font;
  let lineHeight = layer._originalStyle.lineHeight;

  ctx.fillStyle = background;
  ctx.fillRect(xPos, yPos, width, height);

  ctx.fillStyle = color;
  ctx.font = `${fontSize}px ${font}`;
  const text = layer._originalStyle.iconCode;
  const textEncoded = String.fromCharCode(parseInt(text, 16));
  const metrics = measureText(textEncoded, 200, FontFace(font), fontSize, lineHeight);

  const insetX = layer._originalStyle.insetX || 0.5 *((width - metrics.width) / 2) + xPos;
  const insetY = layer._originalStyle.insetY || yPos + ((height - metrics.height) / 2) + metrics.height;

  ctx.fillText(textEncoded, insetX, insetY, width);
  ctx.closePath();
});

var Button = ReactCanvas.createCanvasComponent({
  displayName: 'Button',
  layerType: 'Button',

  applyCustomProps: function (prevProps, props) {
    var style = props.style || {};
    var layer = this.node;
    layer.zIndex = style.zIndex;
  }
});

var Page = React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    article: React.PropTypes.object.isRequired,
    scrollTop: React.PropTypes.number.isRequired
  },

  componentWillMount: function () {
    var article = this.props.article;
    var maxWidth = this.props.width - 2 * CONTENT_INSET;
    var titleStyle = this.getTitleStyle();
    var excerptStyle = this.getExcerptStyle();
    var subcatStyle = this.getSubcatStyle();
    var timeAgoStyle = this.getTimeAgoStyle();
    var agencyTextStyle = this.getAgencyTextStyle();
    var categoryTextStyle = this.getCategoryStyle();
   
    this.titleMetrics = measureText(article.title, maxWidth, titleStyle.fontFace, titleStyle.fontSize, titleStyle.lineHeight);
    this.excerptMetrics = measureText(article.summary, maxWidth, excerptStyle.fontFace, excerptStyle.fontSize, excerptStyle.lineHeight);
    this.subcatMetrics = measureText(`From ${article.subcategory.type}`, maxWidth, subcatStyle.fontFace, subcatStyle.fontSize, subcatStyle.lineHeight);
    this.subcatLabelMetrics = measureText('From', maxWidth, subcatStyle.fontFace, subcatStyle.fontSize, subcatStyle.lineHeight);
    this.subcatTextMetrics = measureText(article.subcategory.type, maxWidth, subcatStyle.fontFace, subcatStyle.fontSize, subcatStyle.lineHeight);
    this.timeAgoMetrics =  measureText(timeAgo(article.date), maxWidth, timeAgoStyle.fontFace, timeAgoStyle.fontSize, timeAgoStyle.lineHeight);
    this.agencyTextMetrics =  measureText(article.agency, maxWidth, agencyTextStyle.fontFace, agencyTextStyle.fontSize, agencyTextStyle.lineHeight);
    this.categoryTextMetrics =  measureText(article.category.name, maxWidth, categoryTextStyle.fontFace, categoryTextStyle.fontSize, categoryTextStyle.lineHeight);
  },

  render: function () {
    var groupStyle = this.getGroupStyle();
    var imageStyle = this.getImageStyle();
    var titleStyle = this.getTitleStyle();
    var excerptStyle = this.getExcerptStyle();
    var metaStyle = this.getMetaBarStyle();
    var subcatStyle = this.getSubcatStyle();
    var subcatLabelStyle = Object.assign({}, subcatStyle);
    var subcatTextStyle = Object.assign({}, subcatStyle);
    var timeAgoStyle = this.getTimeAgoStyle();
    var agencyMetaStyle = this.getAgencyMetaStyle();
    var agencyImageStyle = this.getAgencyImageStyle();
    var agencyTextStyle = this.getAgencyTextStyle();
    var categoryTextStyle = this.getCategoryStyle();

    const { article } = this.props;

    // Layout title and excerpt below image.
    titleStyle.height = this.titleMetrics.height;
    excerptStyle.top = titleStyle.top + titleStyle.height + CONTENT_INSET;
    excerptStyle.height = this.props.height - excerptStyle.top - BOTTOM_BAR_HEIGHT - CONTENT_INSET;
    subcatStyle.height = this.subcatMetrics.height;
    subcatTextStyle.height = this.subcatTextMetrics.height;
    subcatTextStyle.width = this.subcatTextMetrics.width;
    subcatTextStyle.left = this.subcatLabelMetrics.width + CONTENT_INSET + 4;
    subcatTextStyle.color = '#09c';
    subcatLabelStyle.height = this.subcatLabelMetrics.height;
    subcatLabelStyle.width = this.subcatLabelMetrics.width;
    timeAgoStyle.height = this.timeAgoMetrics.height;
    timeAgoStyle.left = this.props.width - (this.timeAgoMetrics.width + CONTENT_INSET);
    agencyTextStyle.height = this.agencyTextMetrics.height;
    agencyTextStyle.width = this.agencyTextMetrics.width;
    categoryTextStyle.height = this.categoryTextMetrics.height;
    categoryTextStyle.width = this.categoryTextMetrics.width;
    categoryTextStyle.top = categoryTextStyle.top + (this.agencyTextMetrics.height - 0.5 * CONTENT_INSET);

    const arrSubcatName = article.subcategory.type.split(":");
    const subcatName = arrSubcatName.length > 1 ? arrSubcatName[1] : arrSubcatName[0];

    let commentStyle = this.getIconStyle();
    commentStyle.fontFace = FontFace(FONT_FACE_DEFAULT, null, {weight: 400});
    const commentMetrics = measureText(`${25} COMMENTS`, 120, commentStyle.fontFace, commentStyle.fontSize, commentStyle.lineHeight);
    commentStyle.width = commentMetrics.width;
    commentStyle.height = commentMetrics.height;

    let sharesStyle = this.getIconStyle();
    sharesStyle.fontFace = FontFace(FONT_FACE_DEFAULT, null, {weight: 400});
    sharesStyle.left = commentMetrics.width + 2*CONTENT_INSET;
    const sharesMetrics = measureText(`${2} SHARES`, 120, sharesStyle.fontFace, sharesStyle.fontSize, sharesStyle.lineHeight);
    sharesStyle.width = sharesMetrics.width;
    sharesStyle.height = sharesMetrics.height;

    let bookmarkStyle = this.getIconStyle();
    bookmarkStyle.fontSize = 20;
    bookmarkStyle.top = bookmarkStyle.top - 0.5 * CONTENT_INSET;
    const bookmarkIcon = String.fromCharCode(parseInt('e912', 16));
    bookmarkStyle.fontFace = FontFace('IconFont', null, {weight: 400});
    const bookmarkMetrics = measureText(bookmarkIcon, 64, bookmarkStyle.fontFace, bookmarkStyle.fontSize, bookmarkStyle.lineHeight);
    bookmarkStyle.left = this.props.width - (bookmarkMetrics.width + 2 * CONTENT_INSET);
    bookmarkStyle.width = bookmarkMetrics.width;
    bookmarkStyle.height = bookmarkMetrics.height;

    let likeStyle = this.getIconStyle();
    likeStyle.fontSize = 20;
    likeStyle.top = likeStyle.top - 0.5 * CONTENT_INSET;
    likeStyle.fontFace = FontFace('IconFont', null, {weight: 400});
    const likeIcon = String.fromCharCode(parseInt('e914', 16));
    const likeMetrics = measureText(likeIcon, 64, likeStyle.fontFace, likeStyle.fontSize, likeStyle.lineHeight);
    likeStyle.left = bookmarkStyle.left - (likeMetrics.width + 3 * CONTENT_INSET);
    likeStyle.width = likeMetrics.width;
    likeStyle.height = likeMetrics.height;

    var ButtonStyle = this.getButtonStyle();

    return (
      <Group style={groupStyle} onClick={this.visitLink}>
        <Image style={imageStyle} src={`http://images.labadipost.com/display?url=${encodeURIComponent(article.image)}&op=noop`} fadeIn={true} useBackingStore={true} />
        <Group style={metaStyle} useBackingStore={true}>
          <Group style={subcatStyle}>
            <Text style={subcatLabelStyle}>From</Text>
            <Text style={subcatTextStyle}>{subcatName}</Text>
          </Group>
          <Text style={timeAgoStyle}>{timeAgo(article.date)}</Text>
        </Group>
        <Group style={agencyMetaStyle} useBackingStore={true}>
          <Image style={agencyImageStyle} src={`http://images.labadipost.com/display?url=${encodeURIComponent(article.agencyImage)}&op=resize&w=48&h=48`} fadeIn={true} useBackingStore={true} />
          <Text style={agencyTextStyle}>{article.agency}</Text>
          <Text style={categoryTextStyle}>{article.category.name}</Text>
        </Group>
        <Group style={this.getTextGroupStyle()} useBackingStore={true}>
          <Text style={titleStyle}>{this.props.article.title}</Text>
          <Text style={excerptStyle}>{this.props.article.summary}</Text>
        </Group>
        <Group style={this.getOptionsStyle()}>
          <Button style={Object.assign({}, ButtonStyle, {
            background: '#3b5998',
            top: 0,
            iconCode: 'e90f',
          })}></Button>
          <Button style={Object.assign({}, ButtonStyle, {
            background: '#0084b4',
            top: this.props.height / 4,
            iconCode: 'e90e',
          })}></Button>
          <Button style={Object.assign({}, ButtonStyle, {
            background: '#BA2D91',
            top: 2 * (this.props.height / 4),
            iconCode: 'e910',
          })}></Button>
          <Button style={Object.assign({}, ButtonStyle, {
            background: '#FDAC3A',
            top: 3 * (this.props.height / 4),
            iconCode: 'e911',
          })}></Button>
        </Group>
        <Group style={this.getBottomBarStyle()}>
          <Text style={commentStyle}>25 COMMENTS</Text>
          <Text style={sharesStyle}>2 SHARES</Text>
          <Text style={likeStyle} onClick={this.like}>&#xe914;</Text>
          <Text style={bookmarkStyle} onClick={this.bookmark}>&#xe912;</Text>
        </Group>
      </Group>
    );
  },

  // Actions
  // ======

  ensureLoggedIn: function() {
    const { isAuthenticated, goToLogin } = this.props;

    return new Promise((resolve, reject) => {
      if (!isAuthenticated) {
        goToLogin();
        reject();
      }
      resolve();
    });
  },

  visitLink: function() {
    const { article, nestedRouteActive } = this.props;
    if (nestedRouteActive) return;

    this.ensureLoggedIn()
      .then(() => {
        window.open(article.link, "_blank");
      }).catch(() => {});
  },

  like: function() {
    this.ensureLoggedIn()
      .then(() => {
        const { article } = this.props;
        this.props.like(article.id);
      }).catch(() => {});
  },

  bookmark: function() {
    this.ensureLoggedIn()
      .then(() => {
        const { article } = this.props;
        this.props.bookmark(article.id);
      }).catch(() => {});
  },

  // Styles
  // ======

  getGroupStyle: function () {
    return {
      top: 0,
      left: 0,
      width: this.props.width,
      height: this.props.height,
    };
  },

  getOptionsStyle: function() {
    const { optionsWidth } = this.props;

    return {
      top: 0,
      left: this.props.width,
      width: optionsWidth,
      height: this.props.height,
    };
  },

  getBottomBarStyle: function() {
    return {
      height: 32,
      top: this.props.height - 32,
      left: 0,
      width: this.props.width,
    };
  },

  getIconStyle: function () {
    var top = this.props.height - 32;
    var translateY = 0;
    translateY = -this.props.scrollTop * TEXT_SCROLL_SPEED_MULTIPLIER;
    var alphaMultiplier = (this.props.scrollTop <= 0) ? -TEXT_ALPHA_SPEED_OUT_MULTIPLIER : TEXT_ALPHA_SPEED_IN_MULTIPLIER;
    var alpha = 1 - (this.props.scrollTop / this.props.height) * alphaMultiplier;
    alpha = Math.min(Math.max(alpha, 0), 1);

    return {
      top: top + 0.5 * CONTENT_INSET,
      left: CONTENT_INSET,
      fontSize: 12,
      textTransform: 'uppercase',
      lineHeight: 24,
      color: '#757575',
      // active: #999
      translateY: translateY,
      alpha: alpha,
      fontFace: FontFace('IconFont', null, {weight: 500}),
    };
  },

  optionsClicked: function() {
    console.log('options was clicked');
  },

  getButtonStyle: function(isActive) {
    return {
      width: 64,
      height: this.props.height / 4,
      font: 'IconFont',
      fontSize: 40,
      color: '#fff',
      background: '#999',
      color: '#fff',
      lineHeight: 50,
      left: this.props.width,
    };
  },

  getAgencyMetaHeight: function() {
    return 48 + CONTENT_INSET;
  },

  getAgencyMetaStyle: function() {
    var imageHeight = this.getImageHeight();
    var metabarHeight = this.getMetaBarHeight();

    var translateY = 0;
    translateY = -this.props.scrollTop * TEXT_SCROLL_SPEED_MULTIPLIER;
    var alphaMultiplier = (this.props.scrollTop <= 0) ? -TEXT_ALPHA_SPEED_OUT_MULTIPLIER : TEXT_ALPHA_SPEED_IN_MULTIPLIER;
    var alpha = 1 - (this.props.scrollTop / this.props.height) * alphaMultiplier;
    alpha = Math.min(Math.max(alpha, 0), 1);

    return {
      top: imageHeight + metabarHeight,
      height: this.getAgencyMetaHeight(),
      width: this.props.width - 2 * CONTENT_INSET,
      left: CONTENT_INSET,
      zIndex: TEXT_LAYER_INDEX,
      alpha: alpha,
      translateY: translateY,
    };
  },

  getAgencyImageStyle: function() {
    var imageHeight = this.getImageHeight();
    var metabarHeight = this.getMetaBarHeight();

    return {
      top: imageHeight + metabarHeight,
      left: CONTENT_INSET,
      width: 48,
      height: 48,
      backgroundColor: '#eee',
      zIndex: TEXT_LAYER_INDEX,
      borderRadius: 24,
    };
  },

  getAgencyTextStyle: function() {
    var imageHeight = this.getImageHeight();
    var metabarHeight = this.getMetaBarHeight();

    return {
      top: imageHeight + metabarHeight + (0.5 * CONTENT_INSET),
      left: 48 + CONTENT_INSET + 10,
      fontFace: FontFace(FONT_FACE_DEFAULT, null, {weight: 400}),
      fontSize: 14,
      color: '#212121',
      lineHeight: 24,
    };
  },

  getCategoryStyle: function() {
    var imageHeight = this.getImageHeight();
    var metabarHeight = this.getMetaBarHeight();

    return {
      top: imageHeight + metabarHeight + (0.5 * CONTENT_INSET),
      left: 48 + CONTENT_INSET + 10,
      fontFace: FontFace(FONT_FACE_DEFAULT, null, {weight: 400}),
      fontSize: 14,
      color: '#09c',
      lineHeight: 24,
    };
  },

  getMetaBarHeight: function() {
    var subcatStyle = this.getSubcatStyle();
    return subcatStyle.lineHeight + 0.6 * CONTENT_INSET;
  },

  getMetaBarStyle: function() {
    var imageHeight = this.getImageHeight();
    var translateY = 0;
    translateY = -this.props.scrollTop * TEXT_SCROLL_SPEED_MULTIPLIER;
    var alphaMultiplier = (this.props.scrollTop <= 0) ? -TEXT_ALPHA_SPEED_OUT_MULTIPLIER : TEXT_ALPHA_SPEED_IN_MULTIPLIER;
    var alpha = 1 - (this.props.scrollTop / this.props.height) * alphaMultiplier;
    alpha = Math.min(Math.max(alpha, 0), 1);

    return {
      height: this.getMetaBarHeight(),
      top: imageHeight,
      width: this.props.width,
      left: 0,
      zIndex: TEXT_LAYER_INDEX,
      color: '#212121',
      alpha: alpha,
      translateY: translateY,
    };
  },

  getAuthorBarHeight: function() {
    return 112;
  },

  getSubcatStyle: function() {
    return {
      fontSize: 16,
      lineHeight: 30,
      top: this.getImageHeight() + 0.5 * CONTENT_INSET,
      left: CONTENT_INSET,
      width: Math.round(this.props.width / 2) - CONTENT_INSET,
      fontFace: FontFace(FONT_FACE_DEFAULT, null, {weight: 400}),
    };
  },

  getTimeAgoStyle: function() {
    return {
      lineHeight: 30,
      top: this.getImageHeight() + 0.5 * CONTENT_INSET,
      width: Math.round(this.props.width / 2) - CONTENT_INSET,
      fontFace: FontFace(FONT_FACE_DEFAULT, null, {weight: 400}),
      fontSize: 16,
      color: '#212121',
    };
  },

  getImageHeight: function () {
    const { article } = this.props;
    if (article.agency !== "" && article.agency.agencyImage !== "") {
      return Math.round(this.props.height * 0.4);
    } else {
      return Math.round(this.props.height * 0.5);
    }
  },

  getImageStyle: function () {
    return {
      top: 0,
      left: 0,
      width: this.props.width,
      height: this.getImageHeight(),
      backgroundColor: '#eee',
      zIndex: IMAGE_LAYER_INDEX,
      alpha: 1,
    };
  },

  getTitleStyle: function () {
    var imageHeight = this.getImageHeight();
    var metabarHeight = this.getMetaBarHeight();
    var agencyMetaHeight = this.getAgencyMetaHeight();
    var top = imageHeight + metabarHeight + agencyMetaHeight;
    return {
      top: top,
      left: CONTENT_INSET,
      width: this.props.width - 2 * CONTENT_INSET,
      fontSize: 22,
      lineHeight: 30,
      fontFace: FontFace(FONT_FACE_DEFAULT, null, {weight: 500})
    };
  },

  getExcerptStyle: function () {
    return {
      left: CONTENT_INSET,
      width: this.props.width - 2 * CONTENT_INSET,
      fontFace: FontFace(FONT_FACE_DEFAULT, null, {weight: 400}),
      fontSize: 15,
      lineHeight: 23,
    };
  },

  getTextGroupStyle: function () {
    var imageHeight = this.getImageHeight();
    var metabarHeight = this.getMetaBarHeight();
    var agencyMetaHeight = this.getAgencyMetaHeight();

    var translateY = 0;
    var alphaMultiplier = (this.props.scrollTop <= 0) ? -TEXT_ALPHA_SPEED_OUT_MULTIPLIER : TEXT_ALPHA_SPEED_IN_MULTIPLIER;
    var alpha = 1 - (this.props.scrollTop / this.props.height) * alphaMultiplier;
    alpha = Math.min(Math.max(alpha, 0), 1);
    translateY = -this.props.scrollTop * TEXT_SCROLL_SPEED_MULTIPLIER;

    return {
      width: this.props.width,
      height: this.props.height - imageHeight,
      top: imageHeight + metabarHeight + agencyMetaHeight,
      left: 0,
      alpha: alpha,
      translateY: translateY,
      zIndex: TEXT_LAYER_INDEX,
    };
  }

});

module.exports = Page;