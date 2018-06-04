import React, { Component, Fragment } from 'react';
import { classes } from '../lib/utils.js';
import SidebarItemButton from './SidebarItemButton.jsx';

export default class SidebarItem extends Component {

  render() {
    const { props } = this;
    // Categorize children
    let buttonElements = [];
    let otherElements = [];
    React.Children.forEach(props.children, (x) => {
      if (x.type === SidebarItemButton) {
        return buttonElements.push(x);
      }
      return otherElements.push(x);
    });
    // Return the element
    return <Fragment>
      <div className={classes('sidebar-item', {
        'sidebar-item-title': props.group,
        'sidebar-item-active': props.active,
        'sidebar-item-link': props.onClick,
      })} onClick={props.onClick}>
        {props.title}
        {buttonElements}
      </div>
      {otherElements}
    </Fragment>
  }

}
