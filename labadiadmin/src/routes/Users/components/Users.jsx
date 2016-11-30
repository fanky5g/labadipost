import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import UserList from './UserList';
import { Spinner } from 'react-mdl';
import * as UserActions from '../actions';

const Users = ({ loading, users }) => (
  <div>
  {loading && <div style={{ background: '#fafafa', textAlign: 'center' }}>
    <Spinner singleColor />
  </div>}
  {!loading && users.length > 0 &&
    <UserList users={users} history={this.props.history} loading={loading} />
  }
  {!loading && !users.length > 0 &&
    <div>
      <span>No Users Registered</span>
    </div>
  }
  </div>
);

Users.propTypes = {
  users: PropTypes.array,
  loading: PropTypes.bool,
};

const hooks = {
  fetch: ({ dispatch, store: { getState } }) => {
    const { isLoaded } = getState().users.toJSON();
    if (!isLoaded) {
      return dispatch(UserActions.getUsers());
    }
    return Promise.resolve();
  },
};

const mapStateToProps = (state) => ({
  users: state.users.toJSON().data,
  loading: state.users.toJSON().actionWaiting,
});

export default provideHooks(hooks)(connect(mapStateToProps)(Users));
