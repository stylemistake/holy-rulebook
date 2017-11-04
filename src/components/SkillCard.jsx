'use strict';

import React from 'react';
import Markdown from 'react-markdown';

export default class SkillCard extends React.Component {

  render() {
    const item = this.props.item;
    return (
      <div className='card'>
        <div className='card-title capitalized'>{item.name}</div>
        <div className='card-content'>
          <Markdown source={item.description} />
        </div>
      </div>
    );
  }

}
