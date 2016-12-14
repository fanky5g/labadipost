import React, { Component } from '#node_modules/react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setOption } from '#common/actions/Topics';

class TopicSelect extends Component {
  state = {
    options: ['agency', 'type'],
  };

  getTopicStyles = () => {
    return {
      background: '#f7f7f7',
      height: this.getSize().height,
    };
  };

  getSelectStyle = () => {
    return {
      display: 'flex',
      flex: '1 100%',
      justifyContent: 'center',
      padding: '20px 5px',
    };
  };

  getSize = () => {
    return document.getElementById("main").getBoundingClientRect();
  };

  getOptionButtonStyle = (opt, index) => {
  	const { option } = this.props;
  	const isActive = opt == option;
    return {
      flex: '1 1',
      borderTop: `2px solid ${isActive ? '#BE0100' : 'silver'}`,
      borderBottom: `2px solid ${isActive ? '#BE0100' : 'silver'}`,
      borderLeft: index == 0 ? `2px solid ${isActive ? '#BE0100' : 'silver'}` : 0,
      borderRight: index == 0 ? `2px solid #BE0100` : `2px solid ${isActive ? '#BE0100' : 'silver'}`,
      color: `${isActive ? '#BE0100' : 'silver'}`,
      padding: '10px 0',
      textAlign: 'center',
      textTransform: 'capitalize',
      cursor: 'pointer',
      borderTopLeftRadius: index == 0 ? '10px' : 0,
      borderBottomLeftRadius: index == 0 ? '10px' : 0,
      borderTopRightRadius: index == 1 ? '10px' : 0,
      borderBottomRightRadius: index == 1 ? '10px' : 0,
      background: '#fff',
      transition: 'border-color .5s ease',
    };
  };

  setOptionType = (opt) => {
    const { dispatch } = this.props;
    dispatch(setOption(opt));
  };

  collectSubcategories = () => {
    const { topics } = this.props;
    const subcategories = topics.reduce((prev, curr) => {
      return curr.subcategories && curr.subcategories.length ? prev.concat(curr.subcategories) : prev;
    }, []);

    return subcategories;
  };

  render() {
  	const { topics, option, dispatch } = this.props;
  	const { options } = this.state;
  	// const subcategories = this.collectSubcategories();
  	console.log(this.collectSubcategories())

  	return (
      <div style={this.getTopicStyles()}>
        <div style={this.getSelectStyle()}>
          {
          	options.map((opt, index) => {
          	  return (
                <a
                  style={this.getOptionButtonStyle(opt, index)}
                  key={index}
                  onClick={() => this.setOptionType(opt)}
                >
                  {`By ${opt}`}
                </a>
          	  );
          	})
          }
        </div>
      </div>
  	);
  }
}

const mapStateToProps = (state) => ({
  option: state.Topics.toJSON().option,
  topics: state.Topics.toJSON().data,
});

export default connect(mapStateToProps)(TopicSelect);