import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Tabs, Tab } from 'react-mdl';
import Confirm from 'common/components/Confirm';
import * as accountActions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Settings extends Component {
  static propTypes = {
    location: PropTypes.object,
    type: PropTypes.string,
    dispatch: PropTypes.func,
    user: PropTypes.object,
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
      tabs: ['', 'contact-details', 'billing'],
      $dirty: false,
    };

    this.registeredHook = undefined;
  }

  componentWillMount() {
    const { location } = this.props;
    const activeState = location.pathname.split('/')[3] || '';
    this.setState({
      selectedTab: this.state.tabs.indexOf(activeState),
    });
  }

  selectTab = (tabId) => {
    if (this.state.selectedTab === tabId) return;
    this.navigate(tabId);
  };

  shouldSave = (isDirty, acceptAction, cancelAction) => new Promise((resolve, reject) => {
    const wrapper = document.body.appendChild(document.createElement('div'));
    const tabId = this.state.tabId;

    function cleanup() {
      ReactDOM.unmountComponentAtNode(wrapper);
      setTimeout(() => wrapper.remove());
    }

    if (isDirty) {
      const modalComponent = ReactDOM.render(
        <Confirm description="You have unsaved data. Leave without saving?" />,
        wrapper);

      modalComponent.$promise.promise.finally(cleanup);
      modalComponent.$promise
      .promise
      .then(() => {
        reject(cancelAction);
      })
      .catch(() => {
        resolve(acceptAction);
      });
    } else {
      resolve(this.go.bind(tabId));
    }
  });

  navigate = (tabId) => {
    if (typeof this.registeredHook === 'function') {
      this.registeredHook().then((action) => {
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
    const route = `/dashboard/settings/${this.state.tabs[tabId]}`;
    router.push(route);
  };

  registerHook = action => {
    this.registeredHook = action;
  };

  render() {
    const { type, user: { address }, notify, message } = this.props;

    return (
      <div className="Settings">
      {
        (type === 'shopper' || type === 'admin' || type === 'delegate') &&
          <Tabs
            activeTab={this.state.selectedTab}
            onChange={this.selectTab}
            ripple
            className="Settings__tabs"
          >
            <Tab>Profile</Tab>
            <Tab>Contact Details</Tab>
          </Tabs>
      }
      {
        (type === 'merchant') &&
          <Tabs
            activeTab={this.state.selectedTab}
            onChange={this.selectTab}
            ripple
            className="Settings__tabs"
          >
            <Tab>Profile</Tab>
            <Tab>Contact Details</Tab>
            <Tab>Merchant Account</Tab>
          </Tabs>
      }
        <section className="Settings__Content grid">
        {
          this.props.children && React.cloneElement(this.props.children, {
            address,
            notify,
            message,
            checkDirtyBeforeUnmount: this.shouldSave,
            registerHook: this.registerHook,
          })
        }
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  message: state.Account.get('message'),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(accountActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
