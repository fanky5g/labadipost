import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export default function requireAuthentication(Component) {
  class AuthenticatedComponent extends React.Component {
    static __redial_handlers__ = Component.__redial_handlers__;

    static propTypes = {
      user: PropTypes.object,
      isAuthenticated: PropTypes.bool,
      location: PropTypes.object.isRequired,
    };

    static contextTypes = {
      router: React.PropTypes.object,
    };

    componentWillMount() {
      this.checkAuth();
    }

    // componentWillReceiveProps() {
    //   this.checkAuth();
    // }

    checkAuth() {
      const { user } = this.props;
      const { router } = this.context;

      if (!this.props.isAuthenticated) {
        const redirectAfterLogin = this.props.location.pathname;
        router.replace(`/login?p=${redirectAfterLogin}`);
      }
    }

    render() {
      return (
        <div style={{ height: '100%' }}>
        {
          this.props.isAuthenticated === true ?
            <Component
              {...this.props}
              type={this.type}
            /> : null
        }
        </div>);
    }
  }

  const mapStateToProps = (state) => ({
    user: state.Account.toJSON().user,
    isAuthenticated: state.Account.get('isAuthenticated'),
  });

  return connect(mapStateToProps)(AuthenticatedComponent);
}
