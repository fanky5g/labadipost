import React, { PropTypes, Component } from 'react';
import { Button } from 'react-mdl';

export default class UnauthorizedComponent extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  goBack = () => {
    const { router } = this.context;
    router.goBack();
  };

  render() {
    return (
      <div>
        <span>user not authorized to visit route</span>
        {'  '}
        <Button raised primary onClick={this.goBack}>Go Back</Button>
      </div>
    );
  }
}
