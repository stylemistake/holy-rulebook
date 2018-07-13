import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { classes } from '../utils.js';

import WidgetValue from './WidgetValue.jsx';
import WidgetTable from './WidgetTable.jsx';
import WidgetText from './WidgetText.jsx';

export default function Widget(props) {
  const className = classes('Widget', props.className, [
    props.horizontal && 'Widget--horizontal',
    props.color && ('Widget--color-' + props.color),
    props.fluid && 'flex-item',
  ]);
  const titleClassName = classes('Widget__title', [
    props.onClick && 'cursor-pointer',
  ]);
  return (
    <div className={className}>
      {props.title && (
        <div className={titleClassName} onClick={props.onClick}>
          {props.title}
        </div>
      )}
      <div className="Widget__content">
        {props.children}
      </div>
    </div>
  );
}

Widget.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  fluid: PropTypes.bool,
  macro: PropTypes.bool,
  rootClass: PropTypes.string,
  titleClass: PropTypes.string,
  contentClass: PropTypes.string,
};

Widget.Value = WidgetValue;
Widget.Table = WidgetTable;
Widget.Text = WidgetText;
