import React from 'react';

export default function WidgetText(props) {
  return (
    <div className="Widget__text">
      {props.content || props.children}
    </div>
  )
}
