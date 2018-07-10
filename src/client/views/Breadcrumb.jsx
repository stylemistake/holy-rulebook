import React, { Fragment } from 'react';
import { ROUTES } from '../store';

export default function Breadcrumb(props) {
  const { router, items } = props;
  const sections = items.map((item, i) => {
    const [route, params] = item;
    const { title } = ROUTES.find(x => x.name === route);
    const isLastItem = i === items.length - 1;
    return (
      <Fragment key={i}>
        {!isLastItem && (
          <a className="section"
            onClick={() => route && router.navigateTo(route, params)}>
            {title}
          </a>
        )}
        {isLastItem && (
          <div className="section active">
            {title}
          </div>
        )}
        {!isLastItem && (
          <i className="right angle icon divider" />
        )}
      </Fragment>
    );
  })
  return (
    <Fragment>
      <div className="ui breadcrumb">
        {sections}
      </div>
      {props.padded && (
        <div style={{ marginTop: '1rem' }} />
      )}
    </Fragment>
  );
}
