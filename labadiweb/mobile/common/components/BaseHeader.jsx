import React from 'react';
import Avatar from '#common/components/Avatar';
import { getButtonChromelessStyles } from '#lib/commonStyles';

function getHeaderStyles() {
  return {
    width: '95%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'space-around',
    paddingLeft: '8px',
    paddingTop: '4px',
  };
}

function getLinkStyle() {
  const buttonChromelessStyle = getButtonChromelessStyles();
  return Object.assign(buttonChromelessStyle, {
    lineHeight: '30px!important',
    height: '32px!important',
  });
}

const BaseHeader = ({isAuthenticated, goToLogin}) => (
  <div style={getHeaderStyles()}>
    <img src="images/logo.png" />
    <div>
        {
          isAuthenticated &&
          <div>
            <Avatar />
          </div>
        }
        {
          !isAuthenticated &&
          <span
            onClick={goToLogin}
            style={getLinkStyle()}
          >
            Sign in
          </span>
        }
      </div>
  </div>
);

export default BaseHeader;