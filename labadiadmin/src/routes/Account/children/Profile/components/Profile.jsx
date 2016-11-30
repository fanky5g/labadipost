import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Cell, IconButton, Button, Spinner } from 'react-mdl';
import User from 'common/components/DashBarUser';
import { connect } from 'react-redux';
import authenticatedComponent from 'common/components/AuthenticatedComponent';
import * as profileActions from '../actions';
import AutosizeInput from 'react-input-autosize';
import mixin from 'lodash/mixin';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import each from 'lodash/each';

class Profile extends Component {
  static propTypes = {
    user: PropTypes.object,
    type: PropTypes.string,
    registerHook: PropTypes.func,
    checkDirtyBeforeUnmount: PropTypes.func,
    notify: PropTypes.func,
    cleanAuthMessage: PropTypes.func,
    dispatch: PropTypes.func,
    isWaiting: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    const { user, type } = this.props;
    this.state = {
      firstName: user.roles[type].firstName,
      lastName: user.roles[type].lastName,
      username: user.username,
      email: user.email,
      title: user.roles[type].title,
      gender: user.roles[type].gender,
      modalIsOpen: false,
    };
    this.currValues = {
      firstName: user.roles[type].firstName,
      lastName: user.roles[type].lastName,
      username: user.username,
      email: user.email,
      title: user.roles[type].title,
      gender: user.roles[type].gender,
    };
    this.$dirty = false;
  }

  componentWillMount() {
    const { registerHook, checkDirtyBeforeUnmount } = this.props;
    registerHook(checkDirtyBeforeUnmount.bind(this, this.$dirty));
  }

  componentWillReceiveProps(nextProps) {
    const { notify, cleanAuthMessage } = this.props;
    if (nextProps.message) {
      notify(nextProps.message, cleanAuthMessage, 5000, 'Ok');
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const originalValues = this.currValues;
    if (this.checkChanged(originalValues, nextState)) {
      this.$dirty = true;
      const { registerHook, checkDirtyBeforeUnmount } = this.props;
      registerHook(checkDirtyBeforeUnmount.bind(this, this.$dirty));
      return true;
    }
    return true;
  }

  onInputClick = () => {
    // evt.target.readOnly = false;
    // evt.target.onblur = this.onLoseFocus.bind(this);
  };

  onLoseFocus = () => {
    // evt.target.readOnly = true;
  };

  onFieldChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  checkChanged(obj1, obj2) {
    const deepEquals = mixin({
      deepEquals: (ar1, ar2) => {
        let stillMatches;
        const fail = () => {
          stillMatches = false;
        };
        if (!((isArray(ar1) && isArray(ar2)) || (isObject(ar1) && isObject(ar2)))) {
          return false;
        }
        if (ar1.length !== ar2.length) {
          return false;
        }
        stillMatches = true;
        each(ar1, (prop1, n) => {
          const prop2 = ar2[n];
          if (prop1 !== prop2 && (n !== '$dirty' && n !== 'modalIsOpen')
            && !deepEquals(prop1, prop2)) {
            fail();
          }
        });
        return stillMatches;
      },
    });

    if (!deepEquals(obj1, obj2)) {
      return true;
    }
    return false;
  }

  editImageClicked = () => {
    const avatarReader = this.refs.avatarInput;
    avatarReader.addEventListener('change', this.handleFiles, false);
    avatarReader.click();
  };

  deleteImageClicked = () => {
    const { dispatch } = this.props;
    dispatch(profileActions.deleteImage());
  };

  handleFiles = (evt) => {
    evt.preventDefault();
    const fileReader = new FileReader();
    const avatar = evt.target.files[0];
    const displayedImage = ReactDOM.findDOMNode(this.refs.avatarImg).children[0];

    displayedImage.file = avatar;
    fileReader.onload = (() => () => {
      // aImg.src = e.target.result;
      this.setState({
        avatar,
      });
    })(displayedImage);
    fileReader.readAsDataURL(avatar);
    this.$dirty = true;
  };

  handleSubmit = () => {
    if (!this.$dirty) return;

    const { state, currValues } = this;
    const { dispatch } = this.props;
    const formData = new FormData();

    Object.keys(state).forEach((key) => {
      if ((state[key] !== undefined) && (currValues[key] !== state[key]) && key !== 'modalIsOpen') {
        if (key === 'avatar') {
          formData.append(key, state[key]);
        } else {
          formData.append(key, JSON.stringify(state[key]));
        }
      } else if (!currValues.hasOwnProperty(key)) {
        if (key === 'avatar') {
          formData.append(key, state[key]);
        } else {
          formData.append(key, JSON.stringify(state[key]));
        }
      }
    });

    dispatch(profileActions.editAccount(formData));
    this.$dirty = false;
  };

  render() {
    const { type, user } = this.props;
    const passedAvatar = user.roles[type].avatarUrl[1] || user.roles[type].avatarUrl[0];
    return (
      <div>
     {
       (type === 'admin') &&
         <div className="DashContent__inner">
           <Cell className="Settings__main" col={10} phone={4} tablet={8}>
             <h2 className="dash_title">Basic Info</h2>
             <div className="Settings__main--big">
               <div>
                 <div className="Settings--profile_avatar inner-div">
                   <User className="avatar-icon" ref="avatarImg" passedAvatar={passedAvatar} />
                   <input
                     type="file"
                     ref="avatarInput"
                     style={{ display: 'none' }}
                     accept="image/*"
                   />
                   <div className="actions">
                     <IconButton name="edit" onClick={this.editImageClicked} />
                     <IconButton name="delete" onClick={this.deleteImageClicked} />
                   </div>
                 </div>
                 <div className="inner-div">
                   <h2 className="dash_title">Name</h2>
                   <AutosizeInput
                     type="text"
                     name="firstName"
                     value={this.state.firstName}
                     onChange={this.onFieldChange}
                     readOnly
                     onClick={this.onInputClick}
                   />
                   <AutosizeInput
                     type="text"
                     name="lastName"
                     value={this.state.lastName}
                     onChange={this.onFieldChange}
                     readOnly
                     onClick={this.onInputClick}
                   />
                 </div>
               </div>
               <div>
                 <div className="inner-div">
                   <h2 className="dash_title">Username</h2>
                   <AutosizeInput
                     type="text"
                     name="username"
                     value={this.state.username}
                     onChange={this.onFieldChange}
                     readOnly
                     onClick={this.onInputClick}
                   />
                 </div>
                 <div className="inner-div">
                   <h2 className="dash_title">Email Id</h2>
                   <AutosizeInput
                     type="email"
                     name="email"
                     value={this.state.email}
                     onChange={this.onFieldChange}
                     readOnly
                     onClick={this.onInputClick}
                   />
                 </div>
               </div>
             </div>
             <Button
               raised
               accent
               className="Settings__action-btn"
               disabled={!this.$dirty}
               onClick={this.handleSubmit}
             >
               Update Admin
               <Spinner
                 singleColor
                 style={{ display: this.props.isWaiting ? 'inline-block' : 'none' }}
               />
             </Button>
           </Cell>
         </div>
      }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isWaiting: state.Account.get('isWaiting'),
});

export default authenticatedComponent(connect(mapStateToProps)(Profile));
