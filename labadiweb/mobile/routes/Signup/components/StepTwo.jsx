import React, { Component, PropTypes } from 'react';
import { Textfield, Button } from 'react-mdl';

class StepTwo extends Component {
  static propTypes = {
    fieldValues: PropTypes.object,
    onCallbackParent: PropTypes.func,
    index: PropTypes.number,
    previous: PropTypes.func,
    next: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      password: props.fieldValues.password,
      passMatchError: '',
      passwordPassed: true,
    };
  }

  onFieldChanged = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value });
  };

  matchPassword = event => {
    if ((event.target.value.length > 0) && (event.target.value !== this.state.password)) {
      this.setState({
        passMatchError: 'Passwords do not match',
        passwordPassed: false,
      });
    } else {
      this.setState({
        passMatchError: '',
        passwordPassed: true,
      });
    }
  };

  render() {
    return (
      <form
        className="Signup__container--step"
        onSubmit={() => this.props.onCallbackParent(this.state, this.props.next)}
      >
        <div className="Signup__container--body-fieldrow">
          <Textfield
            label="Email"
            floatingLabel
            name="email"
            type="email"
            required
            onChange={this.onFieldChanged}
            defaultValue={this.props.fieldValues.email}
          />
        </div>
        <div className="Signup__container--body-fieldrow">
          <Textfield
            label="Username"
            floatingLabel
            name="username"
            required
            onChange={this.onFieldChanged}
            defaultValue={this.props.fieldValues.username}
          />
        </div>
        <div className="Signup__container--body-fieldrow doubly">
          <Textfield
            label="Password"
            floatingLabel
            name="password"
            ref="password"
            type="password"
            required
            onChange={this.onFieldChanged}
            defaultValue={this.props.fieldValues.password}
          />
          <Textfield
            label="Confirm Password"
            floatingLabel
            name="confirmPassword"
            ref="confirm-password"
            type="password"
            required
            onChange={this.matchPassword}
            error={this.state.passMatchError}
          />
        </div>
        <div className="Signup__container--body-fieldrow actions">
        {
          (this.props.index !== 0) &&
            <Button raised onClick={this.props.previous}>Prev</Button>
        }
          <Button raised primary type="submit">Next</Button>
        </div>
      </form>
    );
  }
}

export default React.createFactory(StepTwo);
