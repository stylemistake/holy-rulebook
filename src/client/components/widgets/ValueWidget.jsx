import React, { Component } from 'react';
import { classes } from '../../utils.js';
import Widget from './Widget.jsx';
import Editable from './Editable.jsx';

export default class ValueWidget extends Component {

  render() {
    const { props } = this;
    return <Widget {...props}>
      <Editable className="widget-value"
        value={props.value}
        onChange={props.onChange}
        editable={props.editable} />
    </Widget>;
  }

}
