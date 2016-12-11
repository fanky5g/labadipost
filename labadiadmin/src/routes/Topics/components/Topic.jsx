import React, { PropTypes, Component } from 'react';
import Subcategory from './Subcategory';
import TopicHead from './TopicHead';
import { AccordionItem } from 'react-sanfona';

export default class Topic extends Component {
  render() {
    const { topic, index, expanded, onClick } = this.props;
    console.log(topic)

    return(
      <AccordionItem
        title={<TopicHead title={topic.name} expanded={expanded} />}
        titleClassName="topic-title"
        expandedClassName="expanded"
        expanded={expanded}
        onClick={onClick}
        slug={topic.name}
      >
        <div className="topic-content">
          {
            topic.subcategories.length > 0 &&
            topic.subcategories.map((subcat, index) => {
              return (
                <Subcategory subcat={subcat} key={index} />
              );
            })
          }
        </div>
      </AccordionItem>
    );
  }
} 