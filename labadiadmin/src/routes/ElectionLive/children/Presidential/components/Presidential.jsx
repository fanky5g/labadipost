import React, { Component, PropType } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import { getConstituencies, getPresidentialCandidates, submitResult, undoResetCount } from '../actions'
import { Grid, Cell, Spinner, Button, IconButton } from 'react-mdl';
import User from 'common/components/DashBarUser';
import AutosizeInput from 'react-input-autosize';

class Presidential extends Component {
  state = {
    constituency: { label: 'Select Constituency', value: '' },
    candidateResults: [],
  };

  selectConstituency = (val) => {
    this.setState({
      constituency: val,
    });
  };

  editImageClicked = () => {
    const avatarReader = this.refs.avatarInput;
    avatarReader.addEventListener('change', this.handleFiles, false);
    avatarReader.click();
  };

  handleFiles = (evt) => {
    evt.preventDefault();
    const fileReader = new FileReader();
    const avatar = evt.target.files[0];
    const displayedImage = ReactDOM.findDOMNode(this.refs.avatarImg).children[0];

    displayedImage.file = avatar;
    fileReader.onload = (() => () => {
      // aImg.src = e.target.result;
      this.setState({
        avatar,
      });
    })(displayedImage);
    fileReader.readAsDataURL(avatar);
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
    const { candidateResults } = this.state;
    var editing = candidateResults;
    editing[index].votes.count = evt.target.value;
    this.setState({
      candidateResults: editing,
    });
  };

  componentWillReceiveProps(nextProps) {
    const { presidential, constituencies, resetCount, dispatch } = nextProps;
    const { constituency } = this.state;

    if ((constituency.value == '' && constituencies.length) || resetCount) {
      const c = constituencies[0];
    
      const results = [];
      presidential.forEach((candidate, index) => {
        results.push({
          type: "Presidential",
          candidate: candidate.id,
          name: candidate.candidate,
          constituency: c.name,
          votes: {
            "count": "nil",
          },
        });
      });

      this.setState({
        constituency: { label: c.name, value: c.id },
        candidateResults: results,
      });
      dispatch(undoResetCount());
    }
  }

  validateResults = () => {
    const { notify, presidential } = this.props;
    const { candidateResults, constituency } = this.state;
    var candidates = presidential;
    let passed = true;

    return new Promise((resolve, reject) => {
      if (!candidates) {
      passed = false;
        notify("No candidates active", null, 3000);
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
        type: 'Presidential',
      };

      dispatch(submitResult(resultsToSend));
    }).catch(() => {});
  }

  render() {
    const { constituencies, presidential, loading } = this.props;
    const constOpts = constituencies.map(item => ({ label: item.name, value: item.id }));
    var { constituency, candidateResults } = this.state;
    var candidates = presidential;

    return (
      <div className="Presidential ElectionContent__inner">
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
              <Button ripple style={{ border: '1px solid #dcdcdc' }} onClick={this.submit}>
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
            candidates && candidates.length > 0 &&
            candidates.map((candidate, index) => {
              return (
                <div className="candidate__entry" key={index}>
                  <div>
                    <div className="inner-div head">
                      <h2 className="dash_title">Candidate</h2>
                      <div className="candidate__avatar">
                        <User className="avatar-icon" ref="avatarImg" passedAvatar={candidate.candidateImage} onClick={this.editImageClicked} />
                        <input
                          type="file"
                          ref="avatarInput"
                          style={{ display: 'none' }}
                          accept="image/*"
                        />
                      </div>
                      <AutosizeInput
                        type="text"
                        name="candidate"
                        value={candidate.candidate}
                        readOnly
                        className="input"
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
            <div>
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
    const { constituenciesLoaded, presidentialLoaded } = getState().Presidential.toJSON();
    
    if (!constituenciesLoaded) {
      promises.push(dispatch(getConstituencies()));
    }
    
    if (!presidentialLoaded) {
      promises.push(dispatch(getPresidentialCandidates()));
    }

    return Promise.all(promises);
  },
};

const mapStateToProps = (state) => ({
  constituencies: state.Presidential.toJSON().constituencies,
  presidential: state.Presidential.toJSON().data,
  loading: state.Presidential.toJSON().loading,
  resetCount: state.Presidential.toJSON().resetCount,
});

export default provideHooks(hooks)(connect(mapStateToProps)(Presidential));