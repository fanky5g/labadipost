import React, { Component, PropType } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import { getConstituencies, getParliamentaryCandidates, submitResult } from '../actions';
import { Grid, Cell, Spinner, Button, IconButton } from 'react-mdl';
import AutosizeInput from 'react-input-autosize';

class Parliamentary extends Component {
  state = {
    constituency: { label: 'Select Constituency', value: '' },
    candidateResults: [],
  };

  selectConstituency = (val) => {
    this.setState({
      constituency: val,
    });
  };

  onInputClick = (evt) => {
    evt.target.readOnly = false;
    evt.target.value = "";
    evt.target.onblur = this.onLoseFocus.bind(this);
  };

  onLoseFocus = (evt) => {
    if (evt.target.value === "") {
      evt.target.value = "nil";
    }
    evt.target.readOnly = true;
  };

  enterVote = (evt) => {
    const index = evt.target.dataset.index;
    this.results[index].votes.count = evt.target.value;
    this.setState({
      candidateResults: this.results,
    });
  };

  initInput = (candidates) => {
    const results = [];
    candidates.forEach((candidate, index) => {
      results.push({
        type: "Parliamentary",
        candidate: candidate.id,
        name: candidate.candidate,
        constituency: candidate.constituency,
        votes: {
          "count": "nil",
        },
      });
    });

    this.results = results;
  };

  validateResults = () => {
    const { notify, parliamentary } = this.props;
    const { candidateResults, constituency } = this.state;
    var candidates = parliamentary.find(parl => parl.constituency == constituency.label);
    let passed = true;

    return new Promise((resolve, reject) => {
      if (!candidates) {
      passed = false;
        notify("No candidates active", null, 3000);
        return reject();
      }

      if (candidates && (candidateResults.length !== candidates.count)) {
        passed = false;
        notify("Your entered results are incomplete", null, 3000);
        return reject();
      }

      candidateResults.forEach((item, index) => {
        if (item.votes.count === "nil") {
          passed = false;
          notify(`Votes for candidate ${item.name} is empty`, null, 3000);
          return reject();
        } else {
          item.votes.count = parseInt(item.votes.count, 10);
          this.setState({
            candidateResults: [...candidateResults.slice(0, index), item, ...candidateResults.slice(index + 1)],
          });
        }
      });

      if (passed) {
        return resolve();
      }
    })
    
    return passed;
  };

  submit = () => {
    const { loading, dispatch  } = this.props;
    const { candidateResults, constituency } = this.state;
    
    this.validateResults().then(() => {
      var resultsToSend = {
        constituency: constituency.label,
        data: candidateResults,
        type: 'Parliamentary',
      };

      dispatch(submitResult(resultsToSend));
    }).catch(() => {});
  }

  render() {
    const { constituencies, parliamentary, loading } = this.props;
    const constOpts = constituencies.map(item => ({ label: item.name, value: item.id }));
    var { constituency, candidateResults } = this.state;
    
    var candidates = parliamentary.find(parl => parl.constituency == constituency.label);
    if (candidates && !candidateResults.length) {
      this.initInput(candidates.candidates);
    }

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
              <Button ripple style={{ border: '1px solid #dcdcdc' }} type="submit" onClick={this.submit}>
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
        <div className="ElectionContent__main">
           {
            candidates && candidates.candidates.length > 0 &&
            candidates.candidates.map((candidate, index) => {
              return (
                <div className="candidate__entry" key={index}>
                  <div>
                    <div className="inner-div">
                      <h2 className="dash_title">Candidate</h2>
                      <AutosizeInput
                        type="text"
                        name="candidate"
                        value={candidate.candidate}
                        readOnly
                      />
                    </div>
                    <div className="inner-div">
                      <h2 className="dash_title">Party</h2>
                      <AutosizeInput
                        type="text"
                        name="party"
                        value={candidate.party}
                        readOnly
                      />
                    </div>
                    <div className="inner-div">
                      <h2 className="dash_title">Votes</h2>
                      <AutosizeInput
                        type="text"
                        name="votes"
                        data-index={index}
                        value={candidateResults.length ? candidateResults[index] ? candidateResults[index].votes.count : "nil" : "nil"}
                        onChange={this.enterVote}
                        readOnly
                        onClick={this.onInputClick}
                      />
                    </div>
                  </div>
                </div>
              );
            })
           }
           {
            candidates == undefined &&
            <div style={{padding: '0 20px'}}>
              <span style={{textAlign: 'center'}}>No candidates to show</span>
            </div>
           }
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
  loading: state.Parliamentary.toJSON().loading,
});

export default provideHooks(hooks)(connect(mapStateToProps)(Parliamentary));