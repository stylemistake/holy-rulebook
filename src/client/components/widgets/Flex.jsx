import React, { Component } from 'react';
import { classes } from '../../utils.js';

export default class Flex extends Component {

  render() {
    const { props } = this;
    const rootClass = classes('flex', [
      props.spread && 'flex-spread',
    ]);
    return <div className={rootClass}>
      {this.props.children}
    </div>;
  }

}
