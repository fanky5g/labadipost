import React, { Component } from '#node_modules/react';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import { getStoriesByTopic } from '../actions';
import Home from '#routes/Home/components/Home';
import uniqBy from '#node_modules/lodash/uniqBy';

class Browse extends Component {
	componentWillMount() {
		const { goToUrl } = this.props;
		window.addEventListener("popstate", this.backEventListener);
	}

	componentWillUnmount() {
		window.removeEventListener("popstate", this.backEventListener);
	}

	backEventListener = () => {
		const { goToUrl } = this.props;
    goToUrl(`/options`, {}, { transition: 'slideRightTransition' }, 'replace');
	};

	getPageStyles = () => {
    return {
      background: '#f7f7f7',
      height: this.getSize().height,
    };
  };

  getBoundStyle = () => {
    return {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    };
  };

  getSize = () => {
    return document.getElementById("main").getBoundingClientRect();
  };

	render() {
		const { stories, loading, isAuthenticated } = this.props;

		return (
      <div className="fill" style={this.getPageStyles()} ref="pageContainer">
        {
          loading &&
          <div className="loader" style={{zIndex: 500}}>
            <svg viewBox="0 0 32 32" width="32" height="32">
              <circle id="spinner" cx="16" cy="16" r="14" fill="none"></circle>
            </svg>
          </div>
        }
        {
          !loading && stories.length > 0 &&
          <div className="fill">
            <div style={this.getBoundStyle()}>
              <div className="fill">
                <Home showHamburger={false} stories={uniqBy(stories, 'title')} />
              </div>
            </div>
          </div>
        }
      </div>
		);
	}
}

const decodeUrl = (topic) => {
  const cat = decodeURIComponent(topic).split('@')[0];
  const subTopic = (decodeURIComponent(topic).split('@')[1]).split('~')[0];
  const subId = (decodeURIComponent(topic).split('@')[1]).split('~')[1];
  return {cat, subTopic, subId};
};

const hooks = {
  defer: ({dispatch, store: {getState}, params: {topic}}) => {
  	const { cat, subTopic, subId } = decodeUrl(topic);
    const { category, sub, loaded } = getState().Browse.toJSON();

    const isLoaded = (cat === category && sub === subTopic && loaded == true);
    if (!isLoaded) {
    	return Promise.resolve(dispatch(getStoriesByTopic(cat, subTopic, subId)));
    }

    return Promise.resolve(true);
  },
};

const mapStateToProps = (state, {params: {topic}}) => ({
  topic: decodeUrl(topic).cat,
  sub: decodeUrl(topic).subTopic,
  subId: decodeUrl(topic).subId,
  stories: state.Browse.toJSON().data,
  cursor: state.Browse.toJSON().cursor,
  loading: state.Browse.toJSON().loading,
});

export default provideHooks(hooks)(connect(mapStateToProps)(Browse));