import React, { Component } from '#node_modules/react';
import ReactCanvas from '#node_modules/react-canvas';
import Page from './Page';
import articles from '../data';
import ListView from './ListView';
import { bindActionCreators } from 'redux';
import { likeStory, bookmarkStory } from '../actions';

const Surface = ReactCanvas.Surface;
// const ListView = ReactCanvas.ListView;
const Group = ReactCanvas.Group;
const Layer = ReactCanvas.Layer;

const _size = document.getElementById('main').getBoundingClientRect();
const lineHeight = 1;
const outSetMargin = 15;
const insetMargin = 8;
const lineWidth = 24;
const x = _size.width - (outSetMargin + lineWidth);
const lineAmt= 3;

ReactCanvas.registerLayerType('upperHButton', function (ctx, layer) {
  var xPos = layer._originalStyle.left || 0;

  let y = outSetMargin;
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.globalCompositeOperation = 'source-atop';
  for (let i = 0; i < lineAmt; i++) {
    ctx.moveTo(xPos, y);
    ctx.fillRect(xPos,y,lineWidth,lineHeight + .2);
    y += insetMargin;
  }
});

var UpperHButton = ReactCanvas.createCanvasComponent({
  displayName: 'HamburgerButton',
  layerType: 'upperHButton',
  
  applyCustomProps: function (prevProps, props) {
    var style = props.style || {};
    var layer = this.node;
    layer.zIndex = style.zIndex;
  }
});

ReactCanvas.registerLayerType('lowerHButton', function (ctx, layer) {
  var xPos = layer._originalStyle.left || 0;

  ctx.globalCompositeOperation = 'destination-over';
  let y = outSetMargin;
  ctx.beginPath();
  ctx.lineWidth = lineHeight;
  for (let i = 0; i < lineAmt; i++) {
    ctx.moveTo(xPos, y);
    ctx.lineTo(xPos + lineWidth, y);
    ctx.stroke();
    y += insetMargin;
  }
});

ReactCanvas.registerLayerType('logo', function(ctx, layer) {
  var xPos = layer._originalStyle.left || 0;
  var yPos = layer._originalStyle.top || 0;
  var width = layer._originalStyle.width || 0;
  var height = layer._originalStyle.height || 0;
  var img = new Image();
  ctx.globalCompositeOperation = 'source-over';
  img.src = '/images/logo.svg';
  img.onload = function() {
    layer.invalidateBackingStore();
  }
  ctx.drawImage(img, xPos, yPos, width, height);
});

var Logo = ReactCanvas.createCanvasComponent({
  displayName: 'Logo',
  layerType: 'logo',
});

var LowerHButton = ReactCanvas.createCanvasComponent({
  displayName: 'HamburgerButton',
  layerType: 'lowerHButton',
  
  applyCustomProps: function (prevProps, props) {
    var style = props.style || {};
    var layer = this.node;
    layer.zIndex = style.zIndex;
  }
});

export default class Home extends Component {
  state = {
    left: 0,
  };

  componentWillMount() {
    global.addEventListener('resize', this.handleViewportResize, true);
  }

  handleViewportResize = () => {
    this.forceUpdate();
  };

  renderPage = (pageIndex, scrollTop) => {
    const { stories, nestedRouteActive, isAuthenticated, goToLogin, dispatch } = this.props;
    var size = this.getSize();
    var optionsWidth = this.getOptionsWidth();
    var article = stories[pageIndex];
    var pageScrollTop = pageIndex * this.getPageHeight() - scrollTop;
    
    return (
      <Page
        width={size.width}
        height={size.height}
        article={article}
        pageIndex={pageIndex}
        scrollTop={pageScrollTop}
        nestedRouteActive={nestedRouteActive}
        optionsWidth={optionsWidth}
        goToLogin={goToLogin}
        isAuthenticated={isAuthenticated}
        bookmark={bindActionCreators(bookmarkStory, dispatch)}
        like={bindActionCreators(likeStory, dispatch)}
      />
    );
  };

  updateHeader = (left) => {
    this.setState({ left: left });
  };

  getSize = () => {
    return document.getElementById('main').getBoundingClientRect();
  };

  getListViewStyle = () => {
    var size = this.getSize();
    return {
      top: 0,
      left: 0,
      width: size.width,
      height: size.height
    };
  };

  getNumberOfPages = () => {
    const { stories } = this.props;
    return stories.length;
  };

  getPageHeight = () => {
    return this.getSize().height;
  };

  getPageWidth = () => {
    return this.getSize().width;
  };

  getOptionsWidth = () => {
    return 64;
  };

  goToPrefs = () => {
    this.props.goToURL('options');
  };

  render() {
    const size = this.getSize();
    const { showHamburger } = this.props;
    const { left } = this.state;

    const ratio = window.devicePixelRatio || 1;
    const w = screen.width * ratio;
    const h = screen.height * ratio;

    return (
      <Surface
        top={0}
        left={0}
        width={size.width}
        height={size.height}
        id="surface" style={{width: `${size.width}px`, height: `${size.height}px`}}>
        <ListView
          style={this.getListViewStyle()}
          snapping={true}
          scrollingDeceleration={0.92}
          scrollingPenetrationAcceleration={0.13}
          numberOfItemsGetter={this.getNumberOfPages}
          itemHeightGetter={this.getPageHeight}
          itemWidthGetter={this.getPageWidth}
          optionsWidthGetter={this.getOptionsWidth}
          onScroll={this.updateHeader}
          itemGetter={this.renderPage} />
          {
            showHamburger &&
            <Group>
              <UpperHButton style={{width: 24, height: 30, top: 10, left: x - left}} onClick={this.goToPrefs} />
              <LowerHButton style={{width: 24, height: 30, top: 10, left: x - left}} onClick={this.goToPrefs} />
            </Group>
          }
          <Logo style={{width: 38, height: 38, top: 10, left: 10 - left}}/>
      </Surface>
    );
  }
}
