import React from 'react';
import { pick } from 'lodash';
import { classes } from '../utils.js';

export default function WidgetTable(props) {
  return (
    <table className="Widget__table">
      <tbody>
        {props.content || props.children}
      </tbody>
    </table>
  );
}

function WidgetTableRow(props) {
  const { style, onClick, title, ...rest} = props;
  const className = classes(props.className, {
    'cursor-pointer': onClick,
    'cursor-help': title,
  });
  return (
    <tr {...{ style, onClick, title, className }}>
      {props.content || props.children}
    </tr>
  );
}

function WidgetTableCell(props) {
  const { style, onClick, title, ...rest} = props;
  const className = classes(props.className, {
    'cursor-pointer': onClick,
    'cursor-help': title,
  });
  return (
    <td {...{ style, onClick, title, className }}>
      {props.content || props.children}
    </td>
  );
}

function WidgetTableSimpleItem(props) {
  return (
    <WidgetTableRow {...props}>
      <td>
        {props.name}
      </td>
      <td className="Widget__number-stat">
        {props.value}
      </td>
    </WidgetTableRow>
  );
}

WidgetTable.Row = WidgetTableRow;
WidgetTable.Cell = WidgetTableCell;
WidgetTable.SimpleItem = WidgetTableSimpleItem;
