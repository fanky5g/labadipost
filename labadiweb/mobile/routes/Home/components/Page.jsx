import { timeAgo } from '#lib/date';
var React = require('#node_modules/react');
var ReactCanvas = require('#node_modules/react-canvas');

var Group = ReactCanvas.Group;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var FontFace = ReactCanvas.FontFace;
var measureText = ReactCanvas.measureText;

var CONTENT_INSET = 14;
var TEXT_SCROLL_SPEED_MULTIPLIER = 0.6;
var TEXT_ALPHA_SPEED_OUT_MULTIPLIER = 1.25;
var TEXT_ALPHA_SPEED_IN_MULTIPLIER = 2.6;
var IMAGE_LAYER_INDEX = 2;
var TEXT_LAYER_INDEX = 1;

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
    excerptStyle.height = this.props.height - excerptStyle.top - CONTENT_INSET;
    subcatStyle.height = this.subcatMetrics.height;
    subcatTextStyle.height = this.subcatTextMetrics.height;
    subcatTextStyle.width = this.subcatTextMetrics.width;
    subcatTextStyle.left = this.subcatLabelMetrics.width + CONTENT_INSET + 2;
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

    return (
      <Group style={groupStyle}>
        <Image style={imageStyle} src={`http://images.labadipost.com/display?url=${article.image}&op=noop`} fadeIn={true} useBackingStore={true} />
        <Group style={metaStyle} useBackingStore={true}>
          <Group style={subcatStyle}>
            <Text style={subcatLabelStyle}>From</Text>
            <Text style={subcatTextStyle}>{article.subcategory.type}</Text>
          </Group>
          <Text style={timeAgoStyle}>{timeAgo(article.date)}</Text>
        </Group>
        <Group style={agencyMetaStyle} useBackingStore={true}>
          <Image style={agencyImageStyle} src={`http://images.labadipost.com/display?url=${article.agencyImage}&op=resize&w=48&h=48`} useBackingStore={true} />
          <Text style={agencyTextStyle}>{article.agency}</Text>
          <Text style={categoryTextStyle}>{article.category.name}</Text>
        </Group>
        <Group style={this.getTextGroupStyle()} useBackingStore={true}>
          <Text style={titleStyle}>{this.props.article.title}</Text>
          <Text style={excerptStyle}>{this.props.article.summary}</Text>
        </Group>
      </Group>
    );
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
      top: imageHeight + metabarHeight + (0.5 * CONTENT_INSET),
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
      top: imageHeight + metabarHeight + CONTENT_INSET,
      left: 48 + CONTENT_INSET + 10,
      fontFace: FontFace('-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif', null, {weight: 400}),
      fontSize: 14,
      color: '#333',
      lineHeight: 22,
    };
  },

  getCategoryStyle: function() {
    var imageHeight = this.getImageHeight();
    var metabarHeight = this.getMetaBarHeight();

    return {
      top: imageHeight + metabarHeight + CONTENT_INSET,
      left: 48 + CONTENT_INSET + 10,
      fontFace: FontFace('-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif', null, {weight: 400}),
      fontSize: 14,
      color: '#09c',
      lineHeight: 22,
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
      color: '#333',
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
      fontFace: FontFace('-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif', null, {weight: 400}),
    };
  },

  getTimeAgoStyle: function() {
    return {
      lineHeight: 30,
      top: this.getImageHeight() + 0.5 * CONTENT_INSET,
      width: Math.round(this.props.width / 2) - CONTENT_INSET,
      fontFace: FontFace('-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif', null, {weight: 400}),
      fontSize: 16,
      color: '#333',
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
    var top = imageHeight + metabarHeight + agencyMetaHeight + CONTENT_INSET;
    return {
      top: top,
      left: CONTENT_INSET,
      width: this.props.width - 2 * CONTENT_INSET,
      fontSize: 22,
      lineHeight: 30,
      fontFace: FontFace('-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif', null, {weight: 500})
    };
  },

  getExcerptStyle: function () {
    return {
      left: CONTENT_INSET,
      width: this.props.width - 2 * CONTENT_INSET,
      fontFace: FontFace('-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif'),
      fontSize: 15,
      lineHeight: 23
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
      zIndex: TEXT_LAYER_INDEX
    };
  }

});

module.exports = Page;