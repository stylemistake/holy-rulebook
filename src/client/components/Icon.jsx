import React, { Component, Fragment } from 'react';
import { classes } from '../lib/utils.js';

const ICONS = {
  add: '+',
  remove: '×',
};

export default class Icon extends Component {

  render() {
    const { props } = this;
    return <div
      className={classes('icon', props.className, {
        clickable: props.onClick,
      })}
      {...props}>
      {ICONS[props.icon] || '?'}
    </div>;
  }

}
