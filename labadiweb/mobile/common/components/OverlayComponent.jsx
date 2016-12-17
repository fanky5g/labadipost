import React, { PropTypes, Component } from '#node_modules/react';

const getOverlayDialogStyles = () => {
  return {
    display: 'inline-block',
    outline: 0,
    overflow: 'hidden',
    width: '100%',
    boxShadow: 'none',
    borderRadius: 0,
    verticalAlign: 'middle',
    maxWidth: '100%',
    transformOrigin: 'bottom center',
    background: '#fff',
  };
};

const getOverlayContentStyles = () => {
  return {
    lineHeight: 1.4,
    marginBottom: '30px',
    padding: '0 32px 0',
    margin: '24px 0',
    fontSize: '16px',
    textAlign: 'left',
    color: 'rgba(0, 0, 0, .6)',
    fontSize: '16px',
  };
};

const OverlayChild = ({classNames, children, headerComponent}) => {
  let Header;
  if (headerComponent) {
    Header = React.createFactory(headerComponent);
  }
  return (
    <div style={getOverlayDialogStyles()}>
      {
        headerComponent && Header({})
      }
      <div style={getOverlayContentStyles()}>
        {
          children
        }
      </div>
    </div>
  );
};

export default class Overlay extends Component {
  static propTypes = {
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    isActive: PropTypes.bool.isRequired,
    props: PropTypes.object,
    dispose: PropTypes.func,
  };

  close = () => {
    this.props.dispose();
  };

  getOverlayStyles = (isDark = false) => {
    return {
      position: 'fixed',
      overflow: 'auto',
      textAlign: 'center',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      display: 'block',
      zIndex: 900,
      backgroundColor: isDark ? 'rgba(0, 0, 0, .6)' : 'rgba(255, 255, 255, .97)',
      width: '100%',
      padding: 0,
      margin: 0,
      border: 0,
    };
  };

  getButtonStyles = () => {
    return {
      color: '#fff',
      zIndex: 200,
      top: 0,
      right: '5px',
      fontSize: '26px',
      letterSpacing: 0,
      fontWeight: 300,
      fontStyle: 'normal',
      padding: '5px 10px',
      position: 'absolute',
      background: 'transparent',
      border: 0,
    };
  };

  render() {
    const { component, isActive, props, dispose } = this.props;
    const overlayComponent = React.createFactory(component);

    return (
      <div style={isActive ? this.getOverlayStyles(true) : {"display": "none"}} className="centerContent">
        <button onClick={this.close} style={this.getButtonStyles()}>x</button>
         <OverlayChild headerComponent={props.headerComponent}>
           {
            overlayComponent({
              ...props,
               close: dispose,
             })
           }
         </OverlayChild>
      </div>
    );
  }
}