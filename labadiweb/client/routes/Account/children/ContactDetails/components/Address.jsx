import React, { PropTypes, Component } from 'react';
import AutosizeInput from 'react-input-autosize';
import ReactDOM from 'react-dom';
/* eslint global-require: "off" */
export default class Address extends Component {
  static propTypes = {
    onFieldChange: PropTypes.func,
    editable: PropTypes.bool,
    address: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      fullName: props.address.fullName || '',
      addressLine1: props.address.addressLine1 || '',
      addressLine2: props.address.addressLine2 || '',
      postCode: props.address.postCode || '',
      zip: props.address.zip || '',
      country: props.address.country || '',
      city: props.address.city || '',
      state: props.address.state || '',
      phone: props.address.phone || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    Object.keys(nextProps).map((key) => {
      if (this.state[key] !== nextProps[key]) {
        this.setState({
          [key]: nextProps[key],
        });
      }
      return nextProps[key];
    });
  }

  componentWillUpdate() {
    const DOMNode = ReactDOM.findDOMNode(this);
    if (!DOMNode) return;
    const maxHeight = 600;
    const height = DOMNode.getBoundingClientRect().height;
    const tFrom = { maxHeight: height };
    const tTo = { maxHeight };
    const TWEEN = require('tween.js');
    new TWEEN.Tween(tFrom)
      .to(tTo, 500)
      .onUpdate(function onUpdate() {
        DOMNode.style.maxHeight = `${this.maxHeight}px`;
      })
      .start();

    function animate(time) {
      requestAnimationFrame(animate);
      TWEEN.update(time);
    }
    requestAnimationFrame(animate);
  }

  componentWillEnter(callback) {
    const DOMNode = ReactDOM.findDOMNode(this);
    if (!DOMNode) return callback();
    const height = DOMNode.getBoundingClientRect().height;
    DOMNode.style.maxHeight = 0;
    const tFrom = { maxHeight: 0 };
    const tTo = { maxHeight: height };
    const TWEEN = require('tween.js');
    new TWEEN.Tween(tFrom)
      .to(tTo, 500)
      .onUpdate(function onUpdate() {
        DOMNode.style.maxHeight = `${this.maxHeight}px`;
      })
      .start()
      .onComplete(callback);

    function animate(time) {
      requestAnimationFrame(animate);
      TWEEN.update(time);
    }
    requestAnimationFrame(animate);
    return true;
  }

  componentWillLeave(callback) {
    const DOMNode = ReactDOM.findDOMNode(this);
    if (!DOMNode) return callback();
    const height = DOMNode.getBoundingClientRect().height;
    const tFrom = { maxHeight: height };
    const TWEEN = require('tween.js');
    const tTo = { maxHeight: 0 };
    new TWEEN.Tween(tFrom)
      .to(tTo, 500)
      .onUpdate(function onUpdate() {
        DOMNode.style.maxHeight = `${this.maxHeight}px`;
      })
      .start()
      .onComplete(callback);

    function animate(time) {
      requestAnimationFrame(animate);
      TWEEN.update(time);
    }

    requestAnimationFrame(animate);
    return true;
  }

  render() {
    const { onFieldChange, editable } = this.props;
    let component;

    if (editable) {
      component = (<div className="Settings__main--big">
        <div>
          <div className="inner-div">
            <h2 className="dash_title">Full Name</h2>
            <AutosizeInput
              type="text"
              name="fullName"
              defaultValue={this.state.fullName}
              onChange={onFieldChange}
              readOnly={!editable}
            />
          </div>
        </div>
        <div>
          <div className="inner-div">
            <h2 className="dash_title">Address Line 1</h2>
            <AutosizeInput
              type="text"
              name="addressLine1"
              defaultValue={this.state.addressLine1}
              onChange={onFieldChange}
              readOnly={!editable}
            />
          </div>
        </div>
        <div>
          <div className="inner-div">
            <h2 className="dash_title">Address Line 2</h2>
            <AutosizeInput
              type="text"
              name="addressLine2"
              defaultValue={this.state.addressLine2}
              onChange={onFieldChange}
              readOnly={!editable}
            />
          </div>
        </div>
        <div>
          <div className="inner-div">
            <h2 className="dash_title">Postcode</h2>
            <AutosizeInput
              type="text"
              name="postCode"
              defaultValue={this.state.postCode}
              onChange={onFieldChange}
              readOnly={!editable}
            />
          </div>
          <div className="inner-div">
            <h2 className="dash_title">State</h2>
            <AutosizeInput
              type="text"
              name="state"
              defaultValue={this.state.state}
              onChange={onFieldChange}
              readOnly={!editable}
            />
          </div>
        </div>
        <div>
          <div className="inner-div">
            <h2 className="dash_title">Country</h2>
            <AutosizeInput
              type="text"
              name="country"
              defaultValue={this.state.country}
              onChange={onFieldChange}
              readOnly={!editable}
            />
          </div>
          <div className="inner-div">
            <h2 className="dash_title">Zip</h2>
            <AutosizeInput
              type="text"
              name="zip"
              defaultValue={this.state.zip}
              onChange={onFieldChange}
              readOnly={!editable}
            />
          </div>
        </div>
        <div>
          <div className="inner-div">
            <h2 className="dash_title">Phone</h2>
            <AutosizeInput
              type="text"
              name="phone"
              defaultValue={this.state.phone}
              onChange={onFieldChange}
              readOnly={!editable}
            />
          </div>
          <div className="inner-div">
            <h2 className="dash_title">City</h2>
            <AutosizeInput
              type="text"
              name="city"
              defaultValue={this.state.city}
              onChange={onFieldChange}
              readOnly={!editable}
            />
          </div>
        </div>
      </div>);
    } else {
      component = (<div className="Settings__main--big">
{
  (this.state.fullName !== '') &&
    <div>
      <div className="inner-div">
        <h2 className="dash_title">Full Name</h2>
        <span className="fullName">{this.state.fullName}</span>
      </div>
    </div>
}
{
  (this.state.addressLine1 !== '') &&
    <div>
      <div className="inner-div">
        <h2 className="dash_title">Address Line 1</h2>
        <span className="fullName">{this.state.addressLine1}</span>
      </div>
    </div>
}
{
  (this.state.addressLine2 !== '') &&
    <div>
      <div className="inner-div">
        <h2 className="dash_title">Address Line 2</h2>
        <span className="fullName">{this.state.addressLine2}</span>
      </div>
    </div>
}
{
  (this.state.postCode !== '' || this.state.state) &&
    <div className="double">
    {
      (this.state.postCode !== '') &&
        <div className="inner-div">
          <h2 className="dash_title">Postcode</h2>
          <span className="fullName">{this.state.postCode}</span>
        </div>
    }
    {
      (this.state.state !== '') &&
        <div className="inner-div">
          <h2 className="dash_title">State</h2>
          <span className="fullName">{this.state.state}</span>
        </div>
    }
    </div>
}
{
  (this.state.country !== '' || this.state.zip) &&
    <div className="double">
    {
      (this.state.country !== '') &&
        <div className="inner-div">
          <h2 className="dash_title">Country</h2>
          <span className="fullName">{this.state.country}</span>
        </div>
    }
    {
      (this.state.zip !== '') &&
        <div className="inner-div">
          <h2 className="dash_title">Zip</h2>
          <span className="fullName">{this.state.zip}</span>
        </div>
    }
    </div>
}
{
  (this.state.phone !== '' || this.state.city) &&
    <div className="double">
    {
      (this.state.phone !== '') &&
        <div className="inner-div">
          <h2 className="dash_title">Phone</h2>
          <span className="fullName">{this.state.phone}</span>
        </div>
    }
    {
      (this.state.city !== '') &&
        <div className="inner-div">
          <h2 className="dash_title">City</h2>
          <span className="fullName">{this.state.city}</span>
        </div>
    }
    </div>
}
      </div>);
    }
    return component;
  }
}
