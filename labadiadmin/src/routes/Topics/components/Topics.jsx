import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import { getTopics } from '../actions';
import { Accordion } from 'react-sanfona';
import Subcategory from './Subcategory';
import Topic from './Topic';

class Topics extends Component {
  render() {
    const { topics } = this.props;
    return (
      <div className="Topics container">
        <Accordion allowMultiple className="Topics-container">
            {
              topics.length > 0 &&
              topics.map((topic, index) => {
                return (
                  <Topic key={index} topic={topic} index={index}/>
                );
              })
            }
        </Accordion>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  topics: state.Topics.toJSON().data,
});

const hooks = {
  defer: ({dispatch, store: {getState}}) => {
    return Promise.resolve(dispatch(getTopics()));
  },
};

export default provideHooks(hooks)(connect(mapStateToProps)(Topics));