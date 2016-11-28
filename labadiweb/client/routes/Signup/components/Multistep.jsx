import React, { Component, PropTypes } from 'react';

function getNavStates(indx, length) {
  const styles = [];
  for (let i = 0; i < length; i++) {
    if (i < indx) {
      styles.push('done');
    } else if (i === indx) {
      styles.push('doing');
    } else {
      styles.push('todo');
    }
  }
  return { current: indx, styles };
}


export default class Multistep extends Component {
  static propTypes = {
    steps: PropTypes.array,
    onCallbackParent: PropTypes.func,
    fieldValues: PropTypes.object,
    isWaiting: PropTypes.bool,
    onSignup: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      compState: 0,
      navState: getNavStates(0, this.props.steps.length),
    };
  }

  setNavState = (next) => {
    this.setState({ navState: getNavStates(next, this.props.steps.length) });
    if (next < this.props.steps.length) {
      this.setState({ compState: next });
    }
  };

  handleKeyDown = (evt) => {
    if (evt.which === 13) {
      this.next();
    }
  };

  handleOnClick = (evt) => {
    if (evt.target.value === (this.props.steps.length - 1) &&
       this.state.compState === (this.props.steps.length - 1)) {
      this.setNavState(this.props.steps.length);
    } else {
      this.setNavState(evt.target.value);
    }
  };

  next = (evt) => {
    evt.preventDefault();
    this.setNavState(this.state.compState + 1);
  };

  previous = (evt) => {
    evt.preventDefault();
    if (this.state.compState > 0) {
      this.setNavState(this.state.compState - 1);
    }
  };

  render() {
    const stepComponent = React.createFactory(this.props.steps[this.state.compState].component);
    return (
      <div>
        <ol className="progtrckr">
        {
          this.props.steps.map((s, i) => (
            <li key={i} value={i} className={`progtrckr-${this.state.navState.styles[i]}`}>
              <em>
                {i + 1}
              </em>
              <span>
                {`${this.props.steps[i].name}`}
              </span>
            </li>
            )
          )
        }
        </ol>
        {
          stepComponent({
            next: this.next,
            previous: this.previous,
            index: this.state.compState,
            onCallbackParent: this.props.onCallbackParent,
            fieldValues: this.props.fieldValues,
            isWaiting: this.props.isWaiting,
            onSignup: this.props.onSignup,
          })
        }
      </div>
    );
  }
}
