import React, { Component } from 'react';
import { classes } from '../../lib/utils.js';

export default class ListWidgetItem extends Component {

  render() {
    const { props } = this;
    return <tr>
      <td>{props.name}</td>
      <td className="text-right">{props.value}</td>
    </tr>;
  }

}
