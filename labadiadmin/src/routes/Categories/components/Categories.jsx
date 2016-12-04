import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import { getCategories } from '../actions';
import { Accordion, AccordionItem } from 'react-sanfona';
import Icon from 'react-mdl/lib/Icon';

const CategoryItemHeader = ({ onClick, title, expanded }) => {
  return (
    <div onClick={onClick} className="category mdl-shadow--2dp">
      <Icon name={!expanded ? "expand_more": "expand_less"} />
      <span>{title}</span>
    </div>
  );
};

class CategoryItem extends Component {
  render() {
    const { category, index, expanded, onClick } = this.props;

    return (
      <AccordionItem
        title={<CategoryItemHeader title={category.name} expanded={expanded} />}
        titleClassName="cat-title"
        expandedClassName="expanded"
        expanded={expanded}
        onClick={onClick}
        slug={category.name}
      >
        <div>
          {`Item ${ category.name } content`}
          {index === 3 ? <p><img src="https://cloud.githubusercontent.com/assets/38787/8015584/2883817e-0bda-11e5-9662-b7daf40e8c27.gif" /></p> : null}
        </div>
      </AccordionItem>
    );
  }
}

class Categories extends Component {
  render() {
    const { cats } = this.props;

    return (
      <div className="Categories container">
        <Accordion allowMultiple className="Category-container">
            {
              cats.length > 0 &&
              cats.map((category, index) => {
                return (
                  <CategoryItem key={index} category={category} index={index}/>
                );
              })
            }
        </Accordion>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cats: state.Categories.toJSON().data,
});

const hooks = {
  defer: ({dispatch, store: {getState}}) => {
    return Promise.resolve(dispatch(getCategories()));
  },
};

export default provideHooks(hooks)(connect(mapStateToProps)(Categories));