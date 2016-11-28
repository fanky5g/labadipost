import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import { Header, Icon, Content, Button } from 'react-mdl';
import Q from 'q';

export default class Confirm extends Component {
  static propTypes = {
    cancelAction: PropTypes.func,
    title: PropTypes.string,
    abortLabel: PropTypes.string,
    confirmLabel: PropTypes.string,
    action: PropTypes.func,
    description: PropTypes.string,
  };

  static defaultProps = {
    confirmLabel: 'OK',
    abortLabel: 'Cancel',
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: true,
    };
    this.$promise = Q.defer();
  }

  abort = () => {
    const { cancelAction } = this.props;
    this.setState({
      isModalOpen: false,
    });
    if (typeof cancelAction === 'function') {
      return this.$promise.reject(cancelAction());
    }
    return this.$promise.reject();
  };

  confirm = () => {
    const { action } = this.props;
    this.setState({
      isModalOpen: false,
    });
    if (typeof action === 'function') {
      return this.$promise.reject(action());
    }
    return this.$promise.resolve();
  };

  render() {
    return (
      <Modal isOpen={this.state.isModalOpen}>
        <Header style={{ height: '40px' }}>
          <h4 className="confirmTitle">{this.props.title}</h4>
          <Icon name="cancel" onClick={this.abort} />
        </Header>
        <Content>
        {
          this.props.description &&
            <p>{this.props.description}</p>
        }
          <div className="Button-container">
            <Button onClick={this.abort} raised ref="cancel">{this.props.abortLabel}</Button>
            <Button onClick={this.confirm} raised ref="confirm">{this.props.confirmLabel}</Button>
          </div>
        </Content>
      </Modal>
    );
  }
}
