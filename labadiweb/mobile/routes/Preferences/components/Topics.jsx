import React, { Component } from '#node_modules/react';
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
    const { topics } = this.props;
    const subcategories = topics.reduce((prev, curr) => {
      return curr.subcategories && curr.subcategories.length ?
        prev.concat(curr.subcategories.map(subcat => ({
          ...subcat,
          category: curr.name,
          categoryId: curr.id,
        }))) : prev;
    }, []);

    return groupBy(subcategories, 'category');
  };

  getSize = () => {
    return document.getElementById("main").getBoundingClientRect();
  };

  render() {
    const { topics, dispatch, loading } = this.props;
    const subgroups = this.collectSubcategories();

    return (
      <div>
        {
          !loading &&
          <div className="vbox overflow-scroll">
	          {
	          	Object.keys(subgroups).length > 0 &&
	          	Object.keys(subgroups).map((key, index) => {
	          	  const group = subgroups[key];
	              return (
	                <div key={index}>
	                  <div style={{textAlign: 'center', width: '100%'}}>
	                  	<span style={{textTransform: 'uppercase', fontSize: '16px', fontWeight: '500'}}>{key}</span>
	                  </div>
	                  <Subgroup group={group} option="type" screen={this.getSize()}/>
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
