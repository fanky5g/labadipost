import React, { Component } from '#node_modules/react';
import ReactCanvas from '#node_modules/react-canvas';
import Page from './Page';
import articles from '../data';

const Surface = ReactCanvas.Surface;
const ListView = ReactCanvas.ListView;
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
  let y = outSetMargin;
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.globalCompositeOperation = 'source-atop';
  for (let i = 0; i < lineAmt; i++) {
    ctx.moveTo(x, y);
    ctx.fillRect(x,y,lineWidth,lineHeight + .2);
    y += insetMargin;
    ctx.save();
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
  ctx.globalCompositeOperation = 'destination-over';
  let y = outSetMargin;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.lineWidth = lineHeight;
  for (let i = 0; i < lineAmt; i++) {
    ctx.moveTo(x, y);
    ctx.lineTo(x + lineWidth, y);
    ctx.stroke();
    y += insetMargin;
    ctx.save();
  }
  // ctx.fillRect(x, y, lineWidth, lineHeight);
});

ReactCanvas.registerLayerType('logo', function(ctx, layer) {
  var img = new Image();
  ctx.globalCompositeOperation = 'source-over';
  img.src = '/images/logo.svg';
  img.onload = function() {
    layer.invalidateBackingStore();
  }
  ctx.drawImage(img, 10, 10, 38, 38);
});

var Logo = ReactCanvas.createCanvasComponent({
  displayName: 'Logo',
  layerType: 'logo',

  applyCustomProps: function (prevProps, props) {
    var style = props.style || {};
    var layer = this.node;
  }
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
  constructor(props) {
    super(props);
    this.buttonDif = 40;
  }

  componentWillMount() {
    global.addEventListener('resize', this.handleViewportResize, true);
  }

  handleViewportResize = () => {
    this.forceUpdate();
  };

  renderPage = (pageIndex, scrollTop) => {
    const { stories } = this.props;
    var size = this.getSize();
    var article = stories[pageIndex];
    var pageScrollTop = pageIndex * this.getPageHeight() - scrollTop;

    return (
      <Page
        width={size.width}
        height={size.height}
        article={article}
        pageIndex={pageIndex}
        scrollTop={pageScrollTop} />
    );
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

  goToPrefs = () => {
    this.props.goToURL('options');
  };

  render() {
    const size = this.getSize();

    return (
      <Surface
        top={0}
        left={0}
        width={1080}
        height={1680}
        id="surface" style={{width: `${size.width}px`, height: `${size.height}px`}}>
        <ListView
          style={this.getListViewStyle()}
          snapping={true}
          scrollingDeceleration={0.92}
          scrollingPenetrationAcceleration={0.13}
          numberOfItemsGetter={this.getNumberOfPages}
          itemHeightGetter={this.getPageHeight}
          itemGetter={this.renderPage} />
          <UpperHButton style={{width: 24, height: 30, top: 10, left: x}} onClick={this.goToPrefs} />
          <LowerHButton style={{width: 24, height: 30, top: 10, left: x}} onClick={this.goToPrefs} />
          <Logo />
      </Surface>
    );
  }
}