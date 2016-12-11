import React from 'react';

const TopicHeader = ({ onClick, title, expanded }) => {
  return (
    <div onClick={onClick} className="topic">
      <span>{title}</span>
    </div>
  );
};

export default TopicHeader;