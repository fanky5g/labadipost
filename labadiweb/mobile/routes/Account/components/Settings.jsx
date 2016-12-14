import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
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

    this.registeredHook = undefined;
  }


  shouldSave = (isDirty, acceptAction, cancelAction) => new Promise((resolve, reject) => {
    const wrapper = document.body.appendChild(document.createElement('div'));

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
    }
  });

  registerHook = action => {
    this.registeredHook = action;
  };

  render() {
    const { notify, message } = this.props;

    return (
      <div className="Settings">
        <section className="Settings__Content grid">
        {
          this.props.children && React.cloneElement(this.props.children, {
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
