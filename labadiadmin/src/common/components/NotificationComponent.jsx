import React, { PropTypes } from 'react';
import { Notification } from 'react-notification';

const NotificationComponent = ({ message, label, dismissTimeout, styles, active, action }) => (
  <Notification
    isActive={active}
    message={message}
    action={label}
    onDismiss={action}
    onClick={action}
    dismissAfter={dismissTimeout}
    activeBarStyle={styles.active}
    actionStyle={styles.action}
    barStyle={styles.bar}
  >
  {message}
  </Notification>
);

NotificationComponent.propTypes = {
  message: PropTypes.string,
  label: PropTypes.string,
  dismissTimeout: PropTypes.number,
  styles: PropTypes.object,
  active: PropTypes.bool,
  action: PropTypes.func,
};

export default NotificationComponent;
