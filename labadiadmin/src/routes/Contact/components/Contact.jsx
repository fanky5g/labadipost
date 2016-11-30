import React, { Component, PropTypes } from 'react';
import { Content, Textfield, Button, Spinner } from 'react-mdl';
import * as contactActions from '../actions';

export default class Contact extends Component {
  static propTypes = {
    notify: PropTypes.func,
    message: PropTypes.string,
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { notify, message } = nextProps;
    if (message !== '') {
      notify(message, this.clearMessage, 3000, 'Ok');
    }
  }

  clearMessage = () => {
    const { dispatch } = this.props;
    dispatch(contactActions.clearResponse());
  };

  fieldChanged = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  send = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    if (this.state.message !== '' && this.state.email !== '') {
      dispatch(contactActions.sendMessage(this.state));
    }
  };

  render() {
    const { loading } = this.props;
    return (
      <section className="Contact section">
        <div className="container">
          <div className="contact-container">
            <div className="grid__col--6 contact-info">
              <div className="section-header">
                <h2 className="heading-2">Send us a message</h2>
                <p className="one-full">
                  The Reception Team
                </p>
                <p className="one-full">
                  <a
                    style={{ color: '#fff' }}
                    target="_top"
                    href="mailto:gnaasgh@gmail.com?subject=Website Contact Message"
                  >
                    ipsf2017@gmail.com
                  </a> OR
                </p>
              </div>
            </div>
            <div className="contact-form-wrapper grid__col--6" style={{ background: '#fff' }}>
              <div className="contact-form">
                <form name="contact" onSubmit={this.send}>
                  <Content layout-padding>
                    <div>
                      <Textfield
                        label="Name"
                        name="name"
                        floatingLabel
                        value={this.state.name}
                        required
                        onChange={this.fieldChanged}
                      />
                    </div>
                    <div>
                      <Textfield
                        label="Email"
                        name="email"
                        floatingLabel
                        value={this.state.email}
                        required
                        onChange={this.fieldChanged}
                      />
                    </div>
                    <div>
                      <Textfield
                        label="Subject"
                        name="subject"
                        value={this.state.subject}
                        floatingLabel
                        onChange={this.fieldChanged}
                      />
                    </div>
                    <div>
                      <Textfield
                        label="Message"
                        floatingLabel
                        name="message"
                        value={this.state.message}
                        rows={3}
                        required
                        onChange={this.fieldChanged}
                      />
                    </div>
                    <Button raised ripple type="submit">
                    {
                      !loading &&
                        'Send Message'
                    }
                    {
                      loading &&
                        <Spinner singleColor />
                    }
                    </Button>
                  </Content>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
