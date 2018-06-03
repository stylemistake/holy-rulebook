import React, { Component } from 'react';
import { classes } from '../../lib/utils.js';
import Widget from './Widget.jsx';

export default class TextWidget extends Component {

  render() {
    const { props } = this;
    return <Widget contentClass="widget-content-text" {...props} />;
  }

}
