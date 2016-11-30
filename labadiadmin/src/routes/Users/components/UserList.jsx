import React, { PropTypes, Component } from 'react';
import { Content, IconButton, Menu, MenuItem, Textfield, Cell, Grid } from 'react-mdl';
import authenticatedComponent from 'common/components/AuthenticatedComponent';
import User from 'common/components/DashBarUser';

class UserList extends Component {
  static propTypes = {
    users: PropTypes.array,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    const { users } = this.props;
    this.state = {
      users,
    };
  }

  getType = user => Object.keys(user.roles)[0];

  deleteUser = () => {};

  editUser = (id) => {
    const { users } = this.props;
    const { router } = this.context;
    const index = users.findIndex(item => item._id === id);
    const user = users[index];
    const type = this.getType(user);
    router.push(`/dashboard/users/edit/profile?type=${type}&id=${user._id}`);
  };

  search = (evt) => {
    const query = evt.target.value.trim().toLowerCase();
    this.setState({
      users: this.props.users.filter((item) => {
        const type = this.getType(item);
        const name = (type === 'merchant') ? item.roles[type].companyName :
          `${item.roles[type].firstName} ${item.roles[type].lastName}`;
        return String(name).toLowerCase().indexOf(query) !== -1;
      }),
    });
  };

  filter = (passedType) => {
    this.setState({
      users: this.props.users.filter((item) => {
        const type = this.getType(item);
        if (type !== '') {
          return passedType === type;
        }
        return true;
      }),
    });
  };

  render() {
    const { users } = this.state;
    return (
      <div className="List">
        <Content className="List__container">
          <div className="container">
            <div className="List__actions">
              <Textfield
                onChange={this.search}
                label="Search"
                expandable
                expandableIcon="search"
                className="search"
              />
              <div className="filter">
                <label>Filter</label>
                <IconButton id="filter-menu" name="keyboard_arrow_down" />
                <Menu target="filter-menu" ripple>
                  <MenuItem onClick={() => this.filter('')}>All</MenuItem>
                  <MenuItem onClick={() => this.filter('admin')}>Admins</MenuItem>
                  <MenuItem onClick={() => this.filter('delegate')}>Delegates</MenuItem>
                  <MenuItem onClick={() => this.filter('merchant')}>Merchants</MenuItem>
                  <MenuItem onClick={() => this.filter('shopper')}>Shoppers</MenuItem>
                </Menu>
              </div>
            </div>
			{
              users.map((user, index) => {
                const type = this.getType(user);
                return (
                  <Grid className="List__Item" key={index}>
                    <Cell col={3} className="List__Item_subcontainer">
                      <User
                        passedAvatar={user.roles[type].avatarUrl[1] ||
                        user.roles[type].avatarUrl[0]} className="List__Item_avatar"
                      />
                      {
                        (type === 'merchant') &&
                          <span className="List__Item_name">{user.roles[type].companyName}</span>
                      }
                      {
                        (type !== 'merchant') &&
                          <span className="List__Item_name">
                            {`${user.roles[type].firstName} ${user.roles[type].lastName}`}
                          </span>
                      }
                    </Cell>
                    <Cell col={3} className="List__Item_subcontainer">
                      <span className="List__Item_email">{user.email}</span>
                    </Cell>
                    <Cell col={3} className="List__Item_subcontainer">
                      {
                        user.isActive &&
                          <span className="List__Item_active">
                            <i className="circle active"></i>
                             active
                          </span>
                      }
                      {
                        !user.isActive &&
                          <span className="List__Item_active">
                            <i className="circle inactive"></i> inactive
                          </span>
                      }
                    </Cell>
                    <Cell col={3} className="List__Item_subcontainer List__Item_actions">
                      <div className="inner">
                        <IconButton onClick={() => this.editUser(user._id)} name="edit" />
                        <IconButton onClick={() => this.deleteUser(user._id)} name="delete" />
                      </div>
                    </Cell>
                  </Grid>
                );
              })
            }
          </div>
        </Content>
      </div>
    );
  }
}

export default authenticatedComponent(UserList);
