import React, { PropTypes } from 'react';
import classnames from 'classnames';

const CategoryBar = ({categories, active, setActive}) => {

  return (
    <ul className="category-bar l-borderBottomThinLight l-noWrap l-textAlignLeft l-paddingTop4 l-overflowX l-xs-paddingRight20 l-xs-paddingLeft20 l-xs-paddingTop0">
      {
        categories.length &&
        categories.map((category, index) => {
          return (
            <li className="navItem l-textColorNormal l-xs-paddingRight12 l-xs-marginRight0 l-inlineBlock" key={index}>
              <a
                className={classnames({link: true, 'link--darken': true, 'link--darker': active === category.name})}
                onClick={() => setActive(category.name)}>
                {category.name}
              </a>
            </li>
          );
        })
      }
    </ul>
  );
};

export default CategoryBar;