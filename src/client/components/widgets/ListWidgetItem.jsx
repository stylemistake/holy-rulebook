import React, { Component } from 'react';
import { classes } from '../../utils.js';

export default class ListWidgetItem extends Component {

  render() {
    const { props } = this;
    return <tr
      className={classes({
        clickable: props.onClick,
      })}
      onClick={props.onClick}>
      <td>{props.name}</td>
      <td className="widget-number-stat">
        {props.value}
      </td>
    </tr>;
  }

}
