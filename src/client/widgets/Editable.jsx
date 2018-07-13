import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { classes } from '../utils.js';
import Widget from './Widget.jsx';

export default class Editable extends Component {

  static propTypes = {
    // value: PropTypes.string,
    onChange: PropTypes.func,
    editable: PropTypes.bool,
    readonly: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {
      editing: false,
    };
    this.inputRef = React.createRef();
  }

  commitChange() {
    this.setState({ editing: false });
    if (this.props.onChange && this.props.value !== this.state.value) {
      this.props.onChange(this.state.value);
    }
  }

  revertChange() {
    this.setState({ editing: false });
  }

  onFocus() {
    if (this.state.editing) {
      this.inputRef.current.focus();
    }
  }

  componentDidMount() {
    this.onFocus();
  }

  componentDidUpdate() {
    this.onFocus();
  }

  render() {
    const { props, state } = this;
    // Editing
    if (state.editing) {
      return <input type="text"
        className={props.className}
        ref={this.inputRef}
        style={{
          width: '100%',
          border: '0',
          boxSizing: 'border-box',
          outline: '0',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          fontFamily: 'inherit',
          color: 'inherit',
        }}
        value={state.value}
        onChange={(e) => {
          this.setState({ value: e.target.value });
        }}
        onBlur={() => this.commitChange()}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            this.commitChange();
          }
          if (e.key === 'Escape') {
            this.revertChange();
          }
        }} />;
    }
    // Viewing
    const isEmpty = props.value === undefined
      || props.value === null
      || props.value === '';
    return <div
      className={props.className}
      style={{
        width: '100%',
        height: '100%',
      }}
      onClick={(e) => {
        if (props.editable === false) {
          return;
        }
        this.setState({
          editing: true,
          value: props.value,
        });
      }}>
      {isEmpty ? '--' : props.value}
    </div>;
  }

}
