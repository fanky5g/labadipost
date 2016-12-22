import React, { Component, PropTypes } from '#node_modules/react';
import ReactDOM from 'react-dom';
import Home from './Home';
import { connect } from '#node_modules/react-redux';
import { provideHooks } from '#node_modules/redial';
import { getStories } from '../actions';
import { getTopics } from '#common/actions/Topics';
import TopicSelect from './TopicSelect';
import uniqBy from '#node_modules/lodash/uniqBy';
import Logo from '#common/components/Logo';
import BaseHeader from '#common/components/BaseHeader';
import Login from '#routes/Login';
import { constructOv, replaceOv } from '#common/actions/Overlay';

class RootComponent extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
  };

  componentWillMount() {
    const { router } = this.context;
    const canvasActive = router.isActive('/', true);
    const nestedRouteActive = !canvasActive;
    this.setState({canvasActive, nestedRouteActive});
  }

  componentWillUpdate(nextProps, nextState) {
    const { nestedRouteActive, canvasActive } = nextState;

    if (canvasActive == false && nestedRouteActive == true) {
      const { router } = this.context;
      const c = router.isActive('/', true);
      const n = !canvasActive;

      if  (c !== canvasActive || n !== nestedRouteActive) {
        this.setState({canvasActive: c, nestedRouteActive: n});
      }
    }
  }

  componentDidMount() {
    this.setState({mounted: true});
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.popStateEventListener);
  }

  state = {
    canvasActive: false,
    mounted: false,
    nestedRouteActive: false,
  };

  componentWillReceiveProps(nextProps) {
    const { storiesLoaded, hasPrefs, dispatch, loading } = nextProps;
    if (hasPrefs && !storiesLoaded && !loading) {
      dispatch(getStories());
    }
  }

  getTransitionStyle = () => {
    const { nestedRouteActive } = this.state;

    const size = this.getSize();
    let translateTo = 0;

    const baseTransition = (to) => ({
      position: 'absolute',
      left: '0px',
      top: '0px',
      bottom: '0px',
      right: '0px',
      transitionProperty: 'transform',
      transitionDuration: '380ms',
      transform: `translate(0px, ${to}px) scale(1, 1)`,
    });

    if (!nestedRouteActive) {
      translateTo = size.height - 48;
      this.setState({ nestedRouteActive: true});
      return baseTransition(translateTo);
    }

    if (nestedRouteActive) {
      this.setState({
       nestedRouteActive: false,
      });
      return baseTransition(translateTo);
    }
  }

  getAppStyles = () => {
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

  toggleClearCanvas = () => {
    const { nestedRouteActive, mounted } = this.state;
    const canvasSurface = document.getElementById("surface");
    if (!canvasSurface || !mounted) return;

    Object.assign(canvasSurface.style, this.getTransitionStyle());

    if (nestedRouteActive) {
      setTimeout(() => {
        canvasSurface.removeAttribute('style');
      }, 480);
    }
  };



  restoreCanvas = () => {
    const { router } = this.context;
    // we are already in navigated state, bring canvas back to live
    this.toggleClearCanvas();
    router.push('/');
  };

  popStateEventListener = () => {
    const { nestedRouteActive } = this.state;
    if(location.hash === '' && nestedRouteActive) {
      setTimeout(() => {
        this.restoreCanvas();
      },0);
    }
  };

  visitNestedRoute = (name) => {
    const { canvasActive, nestedRouteActive } = this.state;
    const { router } = this.context;

    const attachBackEvent = () => {
      window.addEventListener('popstate', this.popStateEventListener);
    };

    if (!nestedRouteActive) {
      this.toggleClearCanvas();
      attachBackEvent();
      router.push(name);
    } else {
      this.restoreCanvas();
    }
  };

  goToLogin = () => {
    const Header = React.createClass({
      render() {
        return (
          <div>
            <span
              style={{
                marginBottom: 0,
                display: 'block',
                backgroundColor: '#f0f0f0',
                padding: '24px 24px 24px',
                fontSize: '18px',
                color: 'rgba(0, 0, 0, .8)',
              }}>
              <Logo style={{
                width: '64px',
                height: '64px',
              }}/>
            </span>
          </div>
        );
      },
    });

    this.constructOverlay({
      comp: Login,
      props: {
        headerComponent: Header,
        replaceOverlay: this.replaceOvComponent,
      }
    });
  };

  constructOverlay = ({comp, props}) => {
    const { dispatch } = this.props;
    dispatch(constructOv({
      component: comp,
      props,
    }));
  };

  replaceOvComponent = ({comp, props}) => {
    const { dispatch } = this.props;
    dispatch(replaceOv({
      component: comp,
      props,
    }));
  };

  getLogoStyles = () => {
    return {
      display: 'inline-block',
      lineHeight: '85px',
      height: '85px',
    };
  };

  render() {
    const { nestedRouteActive, canvasActive } = this.state;
    const { stories, cursor, isAuthenticated, hasPrefs, loading, goToUrl } = this.props;

    return (
      <div className="fill" style={this.getAppStyles()} ref="pageContainer">
        {
          !hasPrefs &&
          <div
            className="fill"
            style={{
              background: '#fff',
              color: '#333',
            }}>
              <BaseHeader
                showLogo
                goToLogin={this.goToLogin}
                isAuthenticated={isAuthenticated} />
              {!loading && <TopicSelect isAuthenticated={isAuthenticated} />}
          </div>
        }
        {
          loading &&
          <div className="loader" style={{zIndex: 500}}>
            <svg viewBox="0 0 32 32" width="32" height="32">
              <circle id="spinner" cx="16" cy="16" r="14" fill="none"></circle>
            </svg>
          </div>
        }
        {
          nestedRouteActive &&
          <div className="fill">
            {
              this.props.children &&
              React.cloneElement(this.props.children, {
                goToLogin: this.goToLogin,
                goToUrl,
              })
            }
          </div>
        }
        {
          ((isAuthenticated && hasPrefs) || hasPrefs) && stories.length > 0 && canvasActive &&
          <div className="fill" id="surface">
            <div style={this.getBoundStyle()}>
              <div className="fill">
                <Home goToURL={this.visitNestedRoute} showHamburger={true} nestedRouteActive={nestedRouteActive} stories={uniqBy(stories, 'title')} />
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

const hooks = {
  defer: ({dispatch, store: {getState}}) => {
    const topicsLoaded = getState().Topics.get('loaded');
    const promises = [];

    if (!topicsLoaded) {
      promises.push(dispatch(getTopics()));
    }

    return Promise.all(promises);
  },
};

const mapStateToProps = (state) => ({
  hasPrefs: state.Prefs.get('hasPrefs'),
  storiesLoaded: state.Stories.get('loaded'),
  stories: state.Stories.toJSON().data,
  cursor: state.Stories.toJSON().cursor,
});

export default provideHooks(hooks)(connect(mapStateToProps)(RootComponent));