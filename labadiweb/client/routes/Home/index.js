import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import async from 'async';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCategories, setStories, setActive } from './actions';
import CategoryBar from '#common/components/CategoryBar';
import Height280VerticalImage from './StoryComponents';

class Homepage extends Component {
  /*eslint-disable */
  static onEnter({ store, nextState, replaceState, callback }) {
    const stateNeeds = [];
    const { dispatch } = store;
    stateNeeds.push((cb) => {
      fetch('/api/v1/feeds/categories').then((r) => {
        return r.json();
      }).then((data) => {
        dispatch(setCategories(data));
        cb();
      });
    });

    stateNeeds.push((cb) => {
      fetch('/api/v1/feeds/news').then((r) => {
        return r.json();
      }).then((data) => {
        dispatch(setStories(data));
        cb();
      });
    });

    async.parallel(stateNeeds, (err, results) => {
      callback();
    });
  }
  /*eslint-enable */

  state = {
    renderedComponents: [],
  };

  renderStoryGroups() {
    const { stories, screenWidth } = this.props;
    const { renderedComponents } = this.state;
    const breakPoints = [700, 980, 1370];
    if (renderedComponents.length && !(breakPoints.indexOf(screenWidth) !== -1)) {
      return renderedComponents;
    }

    let groups;

    const pageGapComponent = (
      <div className="page-gap">
        <div
          className="page-content"
          style={{
            position: 'relative',
            left: 0,
            right: 0,
            width: `${screenWidth - 200}px`,
            height: '10px'
          }}>
        </div>
      </div>
    );

    const div580Component = (
      <div className="grid-page">
        <div
          className="page-content"
          style={{
            position: 'relative',
            left: 0,
            right: 0,
            width: `${screenWidth - 200}px`,
            height: '580px'
          }}>
        </div>
      </div>
    );

    const div420Component = (
      <div className="grid-page">
        <div
          className="page-content"
          style={{
            position: 'relative',
            left: 0,
            right: 0,
            width: `${screenWidth - 200}px`,
            height: '420px'
          }}>
        </div>
      </div>
    );

    const div280Component = (
      <div className="grid-page">
        <div
          className="page-content"
          style={{
            position: 'relative',
            left: 0,
            right: 0,
            width: `${screenWidth - 200}px`,
            height: '280px'
          }}>
        </div>
      </div>
    );

    switch(screenWidth) {
      case screenWidth == 700:
        groups = this.renderSmallScreen();
      case screenWidth == 980:
        groups = this.renderMediumScreen();
      case screenWidth == 1370:
        groups = this.renderLargeScreen();
      default:
        console.log('usual render');
    }


      // var components = elements.map(
      //     (b, i) => {
      //         return <ShopProduct key={i} index={i} product={b} 
      //             selectTab={this.selectTab} addToWish={this.addToWish}
      //             replaceLocation={replaceLocation}/>;
      //     }
      // );

      // var groups = [];
      // var children = [];
      // const classes = classNames({
      // 'ones': groups.length % 2 !== 0,
      // 'twos': groups.length % 2 === 0,
      // 'product-row': true
      // });

      // while(components.length > 0) {
      //     children.push(components.shift());
      //     if (children.length === 2) {
      //         groups.push(<div key={groups.length} className={classNames({
      //   'ones': groups.length % 2 !== 0,
      //   'twos': groups.length % 2 === 0,
      //   'product-row': true
      //       })}>{children}</div>);
      //         children = [];
      //     }
      // }
      
      // if (children.length > 0 ) {
      //     groups.push(<div key={groups.length} className={classNames({
      //   'ones': groups.length % 2 !== 0,
      //   'twos': groups.length % 2 === 0,
      //   'product-row': true
      //   })}>{children}</div>);
      // }

      // return groups;
  }

  renderSmallScreen() {
    const { screenWidth, stories } = this.props;
    const filteredWithImages = stories.filter(story => story.image);
    let groups = [], pgCount = 0;

    const components = filteredWithImages.map((story, index) => <Height280VerticalImage story={story} key={index} />);

    const PageGapComponent = React.createClass({
      render() {
        return (
          <div className="page-gap">
            <div
              className="page-content"
              style={{
                position: 'relative',
                left: 0,
                right: 0,
                width: `${screenWidth - 85}px`,
                height: '40px'
              }}>
            </div>
          </div>
        );
      }
    });

    const LastPageGapComponent = React.createClass({
      render() {
        return (
          <div className="page-gap">
            <div
              className="page-content"
              style={{
                position: 'relative',
                left: 0,
                right: 0,
                height: '100px'
              }}>
            </div>
          </div>
        );
      }
    });

    while (components.length > 0) {
      groups.push(components.shift());
      groups.push(<PageGapComponent key={`pg-${pgCount++}`}/>);
    }

    groups.push(<LastPageGapComponent key={`lpg-${pgCount++}`}/>);
    return groups;
  }

  render() {
    const {categories, stories, activeCat, dispatch, screenWidth} = this.props;
    const groups = this.renderSmallScreen()
    return <div>
      <Helmet
        title='Cover Stories on Labadipost'
        meta={[
          {
            property: 'og:title',
            content: 'Labadipost Homepage'
          }
        ]} />
        <div className="cat-banner-container">
          <div className="category-banner">
            <div className="category-main">
              <div className="title">
                <span className="lp">Labadipost</span>
                <span>, streaming your newscontent</span>
              </div>
            </div>
          </div>
          <CategoryBar categories={categories} active={activeCat} setActive={bindActionCreators(setActive, dispatch)}/>
        </div>
        <div className="story-container" style={{minHeight: '641px'}}>
          <div className="layout-view">
            <div className="page-content" style={{position: 'relative', left: 0, right: 0, width: `${screenWidth - 200}px`, height: '10px'}}></div>
          </div>
          {
            groups
          }
        </div>
    </div>;
  }

}

const mapStateToProps = (state) => ({
  categories: state.Categories.toJSON().data,
  activeCat: state.Categories.toJSON().active,
  stories: state.Stories.toJSON().data,
  screenWidth: state.Environment.toJSON().screenWidth,
});

export default connect(mapStateToProps)(Homepage);
// items without pictures are grouped and rendered into a height of 280
