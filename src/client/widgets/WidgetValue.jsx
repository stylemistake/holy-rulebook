import React from 'react';
import Editable from './Editable.jsx';

export default function WidgetValue(props) {
  return (
    <div className="Widget__value">
      <Editable
        value={props.value}
        onChange={props.onChange}
        editable={props.editable} />
    </div>
  );
}
