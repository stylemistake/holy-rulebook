import React, { Component, Fragment } from 'react';

// Renders table of contents
function renderToc(section, indentation = 0) {
  const subsections = section.getSubSections();
  if (!subsections) {
    return null;
  }
  const style = {
    paddingLeft: (indentation + 1) + 'rem',
  };
  return subsections.map((subsection) => (
    <Fragment key={subsection._id}>
      <div className="sidebar-item sidebar-item-link"
        style={style}>
        {subsection.title}
      </div>
      {renderToc(subsection, indentation + 1)}
    </Fragment>
  ));
}

export default class Sidebar extends Component {

  render() {
    const { props } = this;
    return <div className="sidebar">
      {props.children}
    </div>;
  }

}
