import React, { Component, PropType } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import { getConstituencies, getParliamentaryCandidates } from '../actions';
import { Grid, Cell, Spinner, Button } from 'react-mdl';

class Parliamentary extends Component {
  state = {
    constituency: { label: 'Select Constituency', value: '' },
  };

  componentWillMount() {
    const { registerHook, checkDirtyBeforeUnmount } = this.props;
    registerHook(checkDirtyBeforeUnmount.bind(this, this.$dirty));
  }

  selectConstituency = (val) => {
    this.setState({
      constituency: val,
    });
  };

  render() {
    const { constituencies, parliamentary } = this.props;
    const constOpts = constituencies.map(item => ({ label: item.name, value: item.id }));
    var loading = false;
    var { constituency } = this.state;
    
    var candidates = parliamentary.find(parl => parl.constituency == constituency.label);
    console.log(candidates);
    return (
      <div className="Parliamentary ElectionContent__inner">
        <div className="Constituency__select">
          <Grid className="Campaign_Head">
            <Cell col={10} className="Campaign_Options">
              <div className="list_select">
                <Select
                  name="filter-brand"
                  options={constOpts}
                  value={constituency.value}
                  placeholder="Select Constituency to Report for"
                  className="select-list"
                  onChange={this.selectConstituency}
                />
              </div>
            </Cell>
            <Cell col={2} className="Report_Actions">
              <Button ripple style={{ border: '1px solid #dcdcdc' }} type="submit">
                {
                  !loading &&
                    <span>Submit</span>
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

const hooks = {
  defer: ({dispatch, store: {getState}}) => {
    const promises = [];
    const { constituenciesLoaded, parliamentaryLoaded } = getState().Parliamentary.toJSON();
    
    if (!constituenciesLoaded) {
      promises.push(dispatch(getConstituencies()));
    }
    
    if (!parliamentaryLoaded) {
      promises.push(dispatch(getParliamentaryCandidates()));
    }

    return Promise.all(promises);
  },
};

const mapStateToProps = (state) => ({
  constituencies: state.Parliamentary.toJSON().constituencies,
  parliamentary: state.Parliamentary.toJSON().data,
});

export default provideHooks(hooks)(connect(mapStateToProps)(Parliamentary));