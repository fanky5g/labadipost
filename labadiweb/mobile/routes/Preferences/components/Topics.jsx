import React, { Component, PropTypes } from '#node_modules/react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import groupBy from '#node_modules/lodash/groupBy';
import Subgroup from '#routes/Home/components/Subgroup';

class Topics extends Component {
  componentWillMount() {
    global.addEventListener('resize', this.handleViewportResize, true);
  }

  handleViewportResize = () => {
    this.forceUpdate();
  };

  getSelectStyle = () => {
    return {
      display: 'flex',
      flex: '1 100%',
      justifyContent: 'center',
      padding: '5px',
    };
  };

  collectSubcategories = () => {
    const { topics, prefs } = this.props;

    const subcategories = prefs.map(pref => {
      const cat = topics.find(topic => topic.id === pref.categoryId);

      if (cat) {
        const subcat = cat.subcategories.find(subc => subc.id == pref.id);
        return {
          ...subcat,
          category: cat.name,
          categoryId: cat.id,
        };
      }
    });

    return groupBy(subcategories, 'category');
  };

  getSize = () => {
    return document.getElementById("main").getBoundingClientRect();
  };

  getContentStyles = () => {
    return {
      width: `${this.getSize().width + 20}px`,
      margin: '1em 0 0',
    };
  };

  browseTopic = (topic) => {
    const { goToUrl } = this.props;
    goToUrl(`/browse/${encodeURIComponent(topic)}`, {}, { transition: 'slideLeftTransition' });
  };

  render() {
    const { topics, dispatch, loading } = this.props;
    const subgroups = this.collectSubcategories();

    return (
      <div>
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
	                  <Subgroup group={group} selectState={false} clickAction={this.browseTopic} option="type" screen={this.getSize()}/>
	                </div>
	              );
	          	})
	          }
        	</div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  topics: state.Topics.toJSON().data,
  prefs: state.Prefs.toJSON().prefs,
});

export default connect(mapStateToProps)(Topics);
