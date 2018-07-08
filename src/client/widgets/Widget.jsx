import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { classes } from '../utils.js';

export default class Widget extends Component {

  static propTypes = {
    title: PropTypes.string,
    color: PropTypes.string,
    flex: PropTypes.bool,
    macro: PropTypes.bool,
    rootClass: PropTypes.string,
    titleClass: PropTypes.string,
    contentClass: PropTypes.string,
  };

  render() {
    const { props } = this;
    const rootClass = classes('widget', [
      props.color && ('widget-color-' + props.color),
      props.flex && 'flex-item',
      props.onClick && 'clickable',
    ]);
    const titleClass = classes('widget-title', [
      props.macro && 'widget-title-big',
    ]);
    const contentClass = classes('widget-content', [
      props.contentClass,
    ]);
    return <div className={rootClass} onClick={props.onClick}>
      {props.title && <div className={titleClass}>
        {props.title}
        {props.buttons && <div className="float-right">
          {props.buttons}
        </div>}
      </div>}
      <div className={contentClass}>
        {props.children}
      </div>
    </div>;
  }

}
