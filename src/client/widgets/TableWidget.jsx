import React, { Component } from 'react';
import { classes } from '../utils.js';
import Widget from './Widget.jsx';

export default function TableWidget(props) {
  return (
    <Widget {...props}>
      <table className="Widget__table">
        <tbody>
          {props.content || props.children}
        </tbody>
      </table>
    </Widget>
  );
}

function TableWidgetRow(props) {
  return (
    <tr {...props}
      className={classes(props.className, { clickable: props.onClick })}
      onClick={props.onClick}>
      {props.content || props.children}
    </tr>
  );
}

function TableWidgetCell(props) {
  return (
    <td {...props}>
      {props.content || props.children}
    </td>
  );
}

function TableWidgetSimpleItem(props) {
  return (
    <TableWidgetRow {...props}>
      <td>
        {props.itemName}
      </td>
      <td className="Widget__table-statistic">
        {props.itemValue}
      </td>
    </TableWidgetRow>
  );
}

TableWidget.Row = TableWidgetRow;
TableWidget.Cell = TableWidgetCell;
TableWidget.SimpleItem = TableWidgetSimpleItem;
