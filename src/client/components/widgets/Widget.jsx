import React, { Component } from 'react';
import { classes } from '../../lib/utils.js';

export default class Widget extends Component {

  render() {
    const { props } = this;
    const rootClass = classes('widget', [
      props.color && ('widget-color-' + props.color),
      props.flex && 'flex-item',
    ]);
    const titleClass = classes('widget-title', [
      props.macro && 'widget-title-big',
    ]);
    const contentClass = classes('widget-content', [
      props.contentClass,
    ]);
    return <div className={rootClass}>
      <div className={titleClass}>
        {props.title}
      </div>
      <div className={contentClass}>
        {props.children}
      </div>
    </div>;
  }

}
