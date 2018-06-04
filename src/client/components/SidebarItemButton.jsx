import React, { Component, Fragment } from 'react';

export default class SidebarItemButton extends Component {

  render() {
    const { props } = this;
    const icons = {
      add: '+',
      remove: '×',
    };
    const icon = icons[props.icon] || '?';
    return <div className="sidebar-item-button" {...props}>
      {icon}
    </div>;
  }

}
