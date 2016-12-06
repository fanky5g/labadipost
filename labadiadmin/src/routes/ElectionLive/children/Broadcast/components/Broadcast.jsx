import React, { Component, PropType } from 'react';
import { Grid, Cell, Button, Textfield, Spinner } from 'react-mdl';


export default class BroadCast extends Component {
  state = {
    content: '',
  };

  componentWillMount() {
    const { registerHook, checkDirtyBeforeUnmount } = this.props;
    registerHook(checkDirtyBeforeUnmount.bind(this, this.$dirty));
  }

  fieldChanged = () => {

  };

  render() {
    const { content } = this.state;
    var loading = false;
    
    return (
      <div className="Broadcast ElectionContent__inner">
        <div className="Broadcast_Body">
            <Grid className="Form-control">
              <Cell col={10}>
                <Textfield
                  label="Message(*)"
                  onChange={this.fieldChanged}
                  name="content"
                  floatingLabel
                  rows={8}
                  value={content}
                  required
                />
              </Cell>
            </Grid>
            <Grid>
              <Cell col={2} className="Campaign_Actions">
                <Button ripple style={{ border: '1px solid #dcdcdc' }} type="submit">
                  {
                    !loading &&
                      <span>Broadcast</span>
                  }
                  {
                    loading &&
                      <Spinner singleColor />
                  }
                </Button>
              </Cell>
            </Grid>
          </div>
      </div>
    );
  }
}