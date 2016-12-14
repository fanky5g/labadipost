import React, { Component, PropTypes } from 'react';
import { Button, Textfield } from 'react-mdl';

class StepOne extends Component {
  static propTypes = {
    onCallbackParent: PropTypes.func,
    next: PropTypes.func,
    previous: PropTypes.func,
    index: PropTypes.number,
    fieldValues: PropTypes.object,
  };

  onChange = evt => this.setState({ [evt.target.name]: evt.target.value });

  render() {
    return (
      <form
        className="Signup__container--step"
        onSubmit={() => this.props.onCallbackParent(this.state, this.props.next)}
      >
        <div className="Signup__container--body-fieldrow doubly">
          <Textfield
            label="First Name"
            floatingLabel
            onChange={this.onChange}
            name="firstname"
            pattern="^[a-zA-Z ]{2,30}$"
            error="invalid input or length"
            required
            defaultValue={this.props.fieldValues.firstname}
          />
        </div>
        <div className="Signup__container--body-fieldrow">
          <Textfield
            label="Last Name"
            floatingLabel
            onChange={this.onChange}
            name="lastname"
            pattern="^[a-zA-Z-]{2,30}$"
            error="invalid input or length"
            defaultValue={this.props.fieldValues.lastname}
          />
        </div>
        <div className="Signup__container--body-fieldrow actions l-clearfix">
        {
          (this.props.index !== 0) &&
            <Button raised className="" onClick={this.props.previous}>Prev</Button>
        }
          <Button type="submit" className="l-floatRight" style={{ marginLeft: '25%' }}>Next</Button>
        </div>
      </form>
    );
  }
}

export default React.createFactory(StepOne);
