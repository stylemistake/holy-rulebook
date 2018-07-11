import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { classes } from '../utils.js';

export default class Widget extends Component {

  static propTypes = {
    title: PropTypes.string,
    color: PropTypes.string,
    fluid: PropTypes.bool,
    macro: PropTypes.bool,
    rootClass: PropTypes.string,
    titleClass: PropTypes.string,
    contentClass: PropTypes.string,
  };

  render() {
    const { props } = this;
    const rootClass = classes('Widget', [
      props.color && ('Widget--color-' + props.color),
      props.fluid && 'flex-item',
      props.onClick && 'clickable',
    ]);
    const titleClass = classes('Widget__title', [
      props.macro && 'Widget__title--big',
    ]);
    const contentClass = classes('Widget__content', [
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
