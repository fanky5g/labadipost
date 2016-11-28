import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Link from 'react-router/lib/Link';
import { parseImageUrl, drawCanvasWithBlur, Iba } from '#lib/util';

export default class Height280VerticalImage extends Component {
  render() {
    return (
      <h1>{this.props.story.title}</h1>
    );
  }

  componentDidMount() {
    this.c = Iba();
    const CANVAS_BLUR_RADIUS = 8;
    const component = ReactDOM.findDOMNode(this.refs.progressiveMedia);
    const canvas = ReactDOM.findDOMNode(this.refs['progressiveMedia-canvas']);
    const thumbnail = ReactDOM.findDOMNode(this.refs['progressiveMedia-thumbnail']);

    const onThumbnailLoad = () => {
      drawCanvasWithBlur(canvas, thumbnail, CANVAS_BLUR_RADIUS);
      component.classList.add('is-canvasLoaded');
      setTimeout(() => {
        this.loadImage();
      }, 1000);
    };

    if (!thumbnail.complete || thumbnail.naturalWidth === 0) {
      thumbnail.addEventListener('load', function onImageLoaded() {
        thumbnail.removeEventListener('load', onThumbnailLoad);
        onThumbnailLoad();
      });
    } else {
      onThumbnailLoad();
    }

    const aspectRatioFill = ReactDOM.findDOMNode(this.refs['aspectRatioPlaceholder-fill']);
    // var percentage = (thumbnail.naturalHeight / thumbnail.naturalWidth) * 100;
    aspectRatioFill.style.paddingBottom = '30%';

    window.addEventListener('scroll', this.loadImage);
  }

  loadImage = () => {
    const component = ReactDOM.findDOMNode(this.refs.progressiveMedia);
    const image = ReactDOM.findDOMNode(this.refs['progressiveMedia-image']);
    if (this.isVisible() && (!image.complete || image.naturalWidth === 0)) {
      image.src = parseImageUrl({
        url: image.dataset.imageUrl,
        width: 800,
        height: 240,
        strategy: 'crop-preserve',
      }, this.c);

      image.addEventListener('load', function onImageLoaded() {
        image.removeEventListener('load', onImageLoaded);
        component.classList.add('is-imageLoaded');
      });
    }
  };

  getDisplayState = () => {
    const node = ReactDOM.findDOMNode(this.refs['progressiveMedia-image']);
    return node.currentStyle ? node.currentStyle.display : getComputedStyle(node, null).display;
  };

  isVisible = () => {
    if (this.getDisplayState() === 'none') {
      return false;
    }
    const node = ReactDOM.findDOMNode(this.refs['progressiveMedia-image']);
    const rect = node.getBoundingClientRect();
    return (
      (rect.height > 0 || rect.width > 0) &&
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  render() {
    const { story } = this.props;
    const image = {
      url: story.image,
      originalWidth: story.imagewidth,
      originalHeight: story.imageheight,
    };

    return (
      <div className="grid-page">
        <div className="page-content">
          <figure className="graf--figure graf--layoutCroppedHeightPreview graf--leading">
            <div className="aspectRatioPlaceholder is-locked">
              <div className="aspectRatioPlaceholder-fill" ref="aspectRatioPlaceholder-fill"></div>
              <div
                className="progressiveMedia js-progressiveMedia graf-image"
                ref="progressiveMedia"
                data-image-url={image.url}
                data-width={image.originalWidth}
                data-height={image.originalHeight}
                data-scroll="native"
              >
                <img
                  src={
                    parseImageUrl({
                      ...image,
                      width: 30,
                      height: 9,
                      strategy: 'crop-fixed',
                    })
                  }
                  data-image-url={image.url}
                  data-width={image.originalWidth}
                  data-height={image.originalHeight}
                  crossOrigin="anonymous"
                  className="progressiveMedia-thumbnail js-progressiveMedia-thumbnail"
                  ref="progressiveMedia-thumbnail"
                />
                <canvas
                  className="progressiveMedia-canvas js-progressiveMedia-canvas"
                  ref="progressiveMedia-canvas"
                  width="75"
                  height="22"
                >
                </canvas>
                <img
                  className="progressiveMedia-image js-progressiveMedia-image"
                  ref="progressiveMedia-image"
                  data-image-url={image.url}
                  data-width={image.originalWidth}
                  data-height={image.originalHeight}
                />
                <noscript className="js-progressiveMedia-inner">
                  <img
                    className="progressiveMedia-noscript js-progressiveMedia-inner"
                    src={
                      parseImageUrl({
                        ...image,
                        width: 800,
                        height: 240,
                        strategy: 'crop-fixed',
                      })
                    }
                  />
                </noscript>
              </div>
            </div>
          </figure>
        </div>
      </div>
    );
  }
}