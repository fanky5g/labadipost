import React, { PropTypes, Component } from 'react';

const OverlayChild = ({classNames, children, headerComponent}) => {
  let Header;
  if (headerComponent) {
    Header = React.createFactory(headerComponent);
  }
  return (
    <div className={"overlay-dialog overlay-dialog--animate " + classNames}>
      {
        headerComponent && Header({})
      }
      <div className="overlay-content">
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

  render() {
    const { component, isActive, props, dispose } = this.props;
    const overlayComponent = React.createFactory(component);

    return (
      <div style={{"display": isActive ? 'block' : 'none'}} className="overlay overlay--dark">
        <button className="button button--close button--chromeless" onClick={this.close}>x</button>
         <OverlayChild classNames={props.classes || ''} headerComponent={props.headerComponent}>
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