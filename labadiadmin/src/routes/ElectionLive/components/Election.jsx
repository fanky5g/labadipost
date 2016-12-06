import React, { PropTypes, Component } from 'react';
import { Tabs, Tab } from 'react-mdl';

class ElectionLive extends Component {
  static propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    notify: PropTypes.func,
    message: PropTypes.string,
    children: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedTab: 0,
      tabs: ['', 'presidential', 'parliamentary'],
      $dirty: false,
    };

    this.registeredHook = undefined;
  }

  componentWillMount() {
    const { location } = this.props;
    const activeState = location.pathname.split('/')[2] || '';

    this.setState({
      selectedTab: this.state.tabs.indexOf(activeState),
    });
  }

  selectTab = (tabId) => {
    if (this.state.selectedTab === tabId) return;
    this.navigate(tabId);
  };

  shouldSave = (...params) => new Promise((resolve, reject) => {
    const isDirty = params[0];
    const acceptAction = params[1];
    const cancelAction = params[2];
    const tabId = params[params.length - 1];

    function cleanup(wrapper) {
      ReactDOM.unmountComponentAtNode(wrapper);
      setTimeout(() => wrapper.remove());
    }

    if (isDirty) {
      const wrapper = document.body.appendChild(document.createElement('div'));

      const modalComponent = ReactDOM.render(
        <Confirm description="You have unsaved data. Leave without saving?" />,
        wrapper);

      modalComponent.$promise.promise.finally(cleanup.bind(null, wrapper));
      modalComponent.$promise
        .promise
        .then(() => {
          reject(cancelAction);
        })
        .catch(() => {
          resolve(acceptAction);
        });
    } else {
      resolve(this.go(tabId));
    }
  });

  navigate = (tabId) => {
    if (typeof this.registeredHook === 'function') {
      this.registeredHook.call(this, tabId).then((action) => {
        if (typeof action === 'function') action();
      }, (action) => {
        if (typeof action === 'function') action();
        this.go(tabId);
      });
    } else {
      this.go(tabId);
    }
  };

  go = (tabId) => {
    this.setState({
      selectedTab: tabId,
    });
    const { router } = this.context;
    const route = `/electionlive/${this.state.tabs[tabId]}`;
    router.push(route);
  };

  registerHook = action => {
    this.registeredHook = action;
  };

  render() {
    const { message, notify, dispatch } = this.props;

    return (
      <div className="ElectionLive container">
        <Tabs
          activeTab={this.state.selectedTab}
          onChange={this.selectTab}
          className="Election__tabs"
        >
          <Tab>Broadcast</Tab>
          <Tab>Presidential</Tab>
          <Tab>Parliamentary</Tab>
        </Tabs>
        <section className="Election__Content grid">
        {
          this.props.children && React.cloneElement(this.props.children, {
            notify,
            dispatch,
            checkDirtyBeforeUnmount: this.shouldSave,
            registerHook: this.registerHook,
          })
        }
        </section>
      </div>
    );
  }
}

export default ElectionLive;