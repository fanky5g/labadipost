import React, { Component } from '#node_modules/react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setOption } from '#common/actions/Topics';
import groupBy from '#node_modules/lodash/groupBy';
import Subgroup from './Subgroup';
import { disableSelectState, savePrefs } from '#common/actions/Prefs';
import { getButtonChromelessStyles, getButtonStyles } from '#lib/commonStyles';

class TopicSelect extends Component {
  state = {
    options: ['agency', 'type'],
  };

  componentWillMount() {
    global.addEventListener('resize', this.handleViewportResize, true);
  }

  componentWillReceiveProps(nextProps) {
  	const { topics, selectState } = nextProps;
  	if (selectState) {
  	  setTimeout(() => {
  	  	this.enableSelectCountMatch();
  	  }, 500);
  	}
  }

  handleViewportResize = () => {
    this.forceUpdate();
  };

  getTopicStyles = () => {
    return {
      background: '#fff',
      height: this.getSize().height,
    };
  };

  getSelectStyle = () => {
    return {
      display: 'flex',
      flex: '1 100%',
      justifyContent: 'center',
      padding: '5px',
    };
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
      padding: '5px 0',
      textAlign: 'center',
      textTransform: 'capitalize',
      cursor: 'pointer',
      borderTopLeftRadius: index == 0 ? '5px' : 0,
      borderBottomLeftRadius: index == 0 ? '5px' : 0,
      borderTopRightRadius: index == 1 ? '5px' : 0,
      borderBottomRightRadius: index == 1 ? '5px' : 0,
      background: '#fff',
      transition: 'border-color .5s ease',
    };
  };

  setOptionType = (opt) => {
    const { dispatch } = this.props;
    dispatch(setOption(opt));
  };

  collectSubcategories = () => {
    const { topics, option } = this.props;
    const subcategories = topics.reduce((prev, curr) => {
      return curr.subcategories && curr.subcategories.length ?
        prev.concat(curr.subcategories.map(subcat => ({
          ...subcat,
          category: curr.name,
          categoryId: curr.id,
        }))) : prev;
    }, []);

    if (option == 'type') {
      return groupBy(subcategories, 'category');
    } else {
      return groupBy(subcategories, 'agency');
    }
  };

  enableSelectCountMatch = () => {
  	const { topics, dispatch } = this.props;
    const subcategories = topics.reduce((prev, curr) => {
      return curr.subcategories && curr.subcategories.length ?
        prev.concat(curr.subcategories.map(subcat => ({
          ...subcat,
          category: curr.name,
          categoryId: curr.id,
        }))) : prev;
    }, []);

    const selectCount = subcategories.reduce((prev, curr) => {
      return curr && curr.selected ? ++prev : prev;
    }, 0);
    
    if (selectCount == 0) {
      dispatch(disableSelectState());
    }
  };

  getContentStyles = () => {
    const headerHeight = 36;
    const selectHeight = 42;
    const bottomOptions = 42;
    const topMargin = 16;
    const effectiveHeight = this.getSize().height - (headerHeight + selectHeight + bottomOptions + topMargin);


    return {
      height: `${effectiveHeight}px`,
      width: `${this.getSize().width + 20}px`,
      margin: '1em 0 0',
    };
  };

  getSize = () => {
    return document.getElementById("main").getBoundingClientRect();
  };

  getActionButtonStyles = () => {
    const chromeless = getButtonChromelessStyles();
    // #3BA9EE #BE0100
    return Object.assign(chromeless, {
      display: 'flex',
      flex: '1 100%',
      background: 'silver',
      color: '#BE0100',
      justifyContent: 'center',
      height: '42px',
      textTransform: 'uppercase',
      fontWeight: 600,
    });
  };

  explore = () => {
    const { prefs, dispatch } = this.props;
    if (prefs.length) {
      dispatch(savePrefs(prefs));
    }
  };

  render() {
    const { topics, option, dispatch, loading, isAuthenticated } = this.props;
    const { options } = this.state;
    const subgroups = this.collectSubcategories();

    return (
      <div style={this.getTopicStyles()}>
        {
          !loading &&
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
        }
        {
          !loading &&
          <div className="vbox overflow-scroll" style={this.getContentStyles()}>
	          {
	          	Object.keys(subgroups).length > 0 &&
	          	Object.keys(subgroups).map((key, index) => {
	          	  const group = subgroups[key];
	              return (
	                <div key={index}>
	                  <div style={{textAlign: 'center', width: '100%'}}>
	                  	<span style={{textTransform: 'uppercase', fontSize: '16px', fontWeight: '500'}}>{key}</span>
	                  </div>
	                  <Subgroup group={group} option={option} screen={this.getSize()}/>
	                </div>
	              );
	          	})
	          }
        	</div>
        }
        {
        	!loading &&
        	<div style={{maxHeight: '42px', display: 'flex', flex: '100%'}}>
	          <button style={this.getActionButtonStyles()} onClick={this.explore}>{`${isAuthenticated ? 'Save Preferences' : 'Explore'}`}</button>
	        </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectState: state.Prefs.get('selectState'),
  option: state.Topics.toJSON().option,
  topics: state.Topics.toJSON().data,
  prefs: state.Prefs.toJSON().prefs,
});

export default connect(mapStateToProps)(TopicSelect);
