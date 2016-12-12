import React, { PropTypes } from 'react';

const Icon = ({name, className}) => {
  const [type, icon] = name.split("/");
  return (
  	<svg className={className}>
      <use xlinkHref={`/mobile/${type}.svg#${icon}`}></use>
    </svg>
   );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Icon;