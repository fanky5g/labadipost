import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AccountCard from './AccountCard';
import { connect } from 'react-redux';
import BaseHeader from '#common/components/BaseHeader';
import Topics from './Topics';

class Preferences extends Component {
	getPageStyles = () => {
    return {
      overflow: 'auto',
      overflowX: 'hidden',
    };
	};

  componentDidMount() {
    const animateContainer = ReactDOM.findDOMNode(this.refs.animate);
    if (animateContainer) {
      animateContainer.style.transform = 'translateY(0px) scale(1, 1)';
    }
  }

  getTextStyle = () => {
    return {
      textAlign: 'left',
      paddingLeft: '10px',
      fontSize: '16px',
      textRendering: 'optimizeLegibility',
      lineHeight: '32px',
      color: '#333',
    };
  };

	render() {
		const { user, followCount, goToLogin, loading } = this.props;
    var isAuthenticated = false;
    // {!loading && <Topics />}
		return (
      <div className="fill" style={{background: '#000'}}>
        <div className="fill" style={{transition: '380ms', transform: 'translateY(-120px) scale(1, 1)'}} ref="animate">
          <div className="fill" style={{background: '#fff'}}>
            <div style={this.getPageStyles()} className="fill">
              {
                isAuthenticated &&
                <AccountCard user={user} />
              }
              {
                !isAuthenticated &&
                <div>
                  <BaseHeader
                    goToLogin={goToLogin}
                    showLogo={false}
                    isAuthenticated={isAuthenticated} />
                  <div style={this.getTextStyle()}>{`Your favorite Newsfeeds(${followCount})`}</div>
                </div>
              }
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
              <h1>a page</h1>
            </div>
          </div>
        </div>
        <div className="fill" style={{opacity: 0, pointerEvents: 'none', background: 'rgba(0, 0, 0, 0.4)', transition: 'opacity 380ms'}}>
        </div>
      </div>
		);
	}
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Account.get('isAuthenticated'),
  user: state.Account.get('user'),
  followCount: state.Prefs.get('prefs').size,
});

export default connect(mapStateToProps)(Preferences);