import React, { PropTypes } from 'react';
import { Header, Badge, Icon, IconButton, Menu, MenuItem } from 'react-mdl';

const DashBar = ({ messageCount, goToUrl, title, logout }) => (
  <Header className="DashBar" title={<span><strong>#</strong>{title}</span>} scroll>
    <div className="DashBar__right">
      <Badge text={messageCount || '0'}>
        <Icon
          name="announcement"
          style={{ cursor: 'pointer' }}
          onClick={() => goToUrl('/messages')}
        />
      </Badge>
      <IconButton id="account-menu-toggle" name="account_circle" style={{ marginTop: '-15px' }} />
      <Menu
        target="account-menu-toggle"
        ripple
        className="mdl-shadow--3dp"
        valign="bottom"
        align="right"
        style={{ marginLeft: 0 }}
      >
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  </Header>
);

DashBar.propTypes = {
  messageCount: PropTypes.number,
  goToUrl: PropTypes.func,
  title: PropTypes.string,
};

export default DashBar;
