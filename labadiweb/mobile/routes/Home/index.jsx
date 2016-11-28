import React, { Component } from '#node_modules/react';
import ReactCanvas from '#node_modules/react-canvas';
import Page from './components/Page';
import articles from './data';

const Surface = ReactCanvas.Surface;
const ListView = ReactCanvas.ListView;
const Button = ReactCanvas.Layer;


export default class Home extends Component {
  componentWillMount() {
    global.addEventListener('resize', this.handleViewportResize, true);
  }

  handleViewportResize = () => {
    this.forceUpdate();
  };

  renderPage = (pageIndex, scrollTop) => {
    console.log(pageIndex);
    console.log(scrollTop);
    var size = this.getSize();
    var article = articles[pageIndex % articles.length];
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
    return document.getElementById('app').getBoundingClientRect();
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
    return 1000;
  };

  getPageHeight = () => {
    return this.getSize().height;
  };

  getButtonStyle = () => {
    console.log('button style get called')
    return {
      left: 8,
      position: 'absolute',
      zIndex: 100,
      backgroundColor: 'red',
      top: 8,
      width: 40,
      height: 40,
    }; 
  };

  handleButtonClick = () => {
    console.log('the icon button was clicked');
  };

  render() {
    const size = this.getSize();
    return (
      <Surface top={0} left={0} width={size.width} height={size.height}>
        <Button style={this.getButtonStyle()} onTouchStart={this.handleButtonClick}/>
        <ListView
          style={this.getListViewStyle()}
          snapping={true}
          scrollingDeceleration={0.92}
          scrollingPenetrationAcceleration={0.13}
          numberOfItemsGetter={this.getNumberOfPages}
          itemHeightGetter={this.getPageHeight}
          itemGetter={this.renderPage} />
      </Surface>
    );
  }
}

// getDepth if depth is 3 show white, else show blackk