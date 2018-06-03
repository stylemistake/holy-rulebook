import React, { Component } from 'react';
import { classes } from '../../lib/utils.js';
import Widget from './Widget.jsx';

export default class ValueWidget extends React.Component {

  constructor() {
    super();
    this.state = {
      editing: false,
    };
    this.inputRef = React.createRef();
  }

  render() {
    const { props, state } = this;
    const viewElement = (
      <div className="widget-content-value"
        onClick={(e) => {
          // if (!props.editable) {
          //   return;
          // }
          this.setState({
            editing: true,
            value: props.value,
          });
          setTimeout(() => this.inputRef.current.focus(), 10);
        }}>
        {props.value}
      </div>
    );
    const editElement = (
      <input type="number"
        className="widget-content-value"
        ref={this.inputRef}
        style={{ width: '100%', height: '100%' }}
        value={state.value}
        onChange={(e) => {
          this.setState({ value: e.target.value });
        }}
        onBlur={(e) => {
          this.setState({ editing: false });
          props.onChange && props.onChange(state.value);
        }} />
    );
    return <Widget {...props}>
      {state.editing ? editElement : viewElement}
    </Widget>;
  }

}
