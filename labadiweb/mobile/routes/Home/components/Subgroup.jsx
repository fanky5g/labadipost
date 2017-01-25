import React, { Component } from 'react';
import Tappable from 'react-tappable/lib/Tappable';
import { connect } from 'react-redux';
import { enableSelectState } from '#common/actions/Prefs';
import { selectItem } from '#common/actions/Topics';

class Subgroup extends Component {
  getEntryStyle = (selected) => {
  	const { screen: {width}} = this.props;
  	const effectiveWidth = (width - 4) / 3;
  	const effectiveHeight = 1.2*effectiveWidth;
    return {
      position: 'relative',
      display: 'inline-block',
      width: `${effectiveWidth}px`,
      height: `${effectiveHeight}px`,
      backgroundColor: '#333',
      // marginBottom: '2px',
      marginRight: '3px',
      cursor: 'pointer',
      opacity: selected ? 0.6 : 1,
    };
  };

  getImageStyle = () => {
    return {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      zIndex: 1,
    };
  };

  getTitleStyle = () => {
    return {
      position: 'absolute',
      left: '10px',
      top: '10px',
      right: '10px',
      zIndex: 3,
      color: '#fff',
      fontSize: '13px',
      lineHeight: '16px',
      fontWeight: 600,
    };
  };

  itemPressed = (id, catId, selected) => {
  	const { dispatch, selectState, clickAction } = this.props;

    if (clickAction && typeof clickAction === "function") return;

  	if (!selectState && !selected) {
  	  dispatch(enableSelectState());
      dispatch(selectItem(id, catId));
      if ("navigator" in window && typeof navigator.vibrate == "function") {
        navigator.vibrate(100);
      }
  	}
  };

  itemTapped = (id, catId, topic) => {
    const { dispatch, selectState, clickAction } = this.props;

    if (clickAction && typeof clickAction === "function") {
      return clickAction(topic);
    }

    if (selectState) {
      dispatch(selectItem(id, catId));
    }
  };

  getIconStyle = () => {
    return {
      position: 'absolute',
      right: 0,
      top: 0,
      color: '#fff',
      zIndex: 3,
      fontSize: '28px',
    };
  };

  render() {
  	const { group, option, selectState } = this.props;

  	// agency agencyImage category categoryId id image type "News:General"
  	return (
      <div style={{padding: '5px 0', position: 'relative', marginBottom: '8px'}}>
        {
          group.length > 0 &&
          group.map((entry, index) => {
          	const name = entry.type.split(':')[0];

            return (
              <Tappable
                key={index}
                onPress={() => this.itemPressed(entry.id, entry.categoryId, entry.selected)}
                onTap={() => this.itemTapped(entry.id, entry.categoryId, `${entry.category}@${entry.type}~${entry.id}`)}
                pressDelay={300}
              >
	              <div style={this.getEntryStyle(entry.selected)}>
			        <div style={this.getImageStyle()}>
			          <div style={{position: 'relative', width: '100%', height: '100%'}}>
			            <div
			              ref="imgContainer"
			              style={{
			                opacity: 1,
			                width: '100%',
			                height: '100%',
			                backgroundSize: 'cover',
			                backgroundPosition: 'center center',
			                backgroundRepeat: 'no-repeat',
			                backgroundImage: `url(http://images.labadipost.com/display?url=${encodeURIComponent(entry.image)}&op=noop)`
			              }}>
			            </div>
			          </div>
			        </div>
			        {
			          entry.selected &&
                      <span style={this.getIconStyle()}>&otimes;</span>
			        }
			        <div style={this.getTitleStyle()}>
			          {name}
			        </div>
			      </div>
		      </Tappable>
            );
          })
        }
      </div>
  	);
  }
}

const mapStateToProps = (state, ownProps) => ({
  selectState: ownProps.selectState || state.Prefs.get('selectState'),
});

export default connect(mapStateToProps)(Subgroup);
