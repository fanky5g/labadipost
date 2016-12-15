import React, { PropTypes } from 'react';

const Icon = ({name, className, style}) => {
  const [type, icon] = name.split("/");

  return (
  	<svg className={className} style={style}>
      <use xlinkHref={`/mobile/${type}.svg#${icon}`}></use>
    </svg>
   );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Icon;