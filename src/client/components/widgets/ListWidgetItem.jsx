import React, { Component } from 'react';
import { classes } from '../../lib/utils.js';

export default class ListWidgetItem extends Component {

  render() {
    const { props } = this;
    return <tr>
      <td>{props.name}</td>
      <td className="widget-number-stat">
        {props.value}
      </td>
    </tr>;
  }

}
