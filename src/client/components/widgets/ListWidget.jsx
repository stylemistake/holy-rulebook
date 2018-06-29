import React, { Component } from 'react';
import { classes } from '../../utils.js';
import Widget from './Widget.jsx';

export default class ListWidget extends Component {

  render() {
    const { props } = this;
    return <Widget contentClass="widget-table" {...props}>
      <table>
        <tbody>
          {props.children}
        </tbody>
      </table>
    </Widget>;
  }

}
