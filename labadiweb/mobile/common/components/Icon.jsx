import React, { PropTypes } from 'react';

const Icon = ({name, className, style}) => {
  const [type, icon] = name.split("/");

  return (
  	<svg role="img" title={icon} className={className} style={style}>
      <use xlinkHref={`/mobile/${type}.svg#${icon}`} />
    </svg>
   );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Icon;