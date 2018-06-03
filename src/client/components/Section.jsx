'use strict';

import React from 'react';
import Markdown from 'react-remarkable';

export default class Section extends React.Component {

  render() {
    const item = this.props.item;
    return (
      <div className='section'>
        <div className='section-title capitalized'>{item.title}</div>
        <div className='section-content'>
          <Markdown source={item.text} options={{ html: true }} />
        </div>
      </div>
    );
  }

}
