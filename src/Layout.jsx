'use strict';

import React from 'react';

import SkillCard from './components/SkillCard.jsx';
import Section from './components/Section.jsx';
import Store from './lib/Store.js';
import { bound, throttle } from './lib/decorators.js';
import SkillTable from './components/SkillTable.jsx';

const acrobatics = Store.query('/skills/acrobatics');
const sections = Store.queryAll('/sections/skills');
const skills = Store.findSkills();
const toc = Store.query('/toc');

// Container for nesting multiple react components
const Aux = (props) => props.children;

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
    <Aux key={subsection._id}>
      <div className='sidebar-item sidebar-item-link'
        style={style}>
        {subsection.title}
      </div>
      {renderToc(subsection, indentation + 1)}
    </Aux>
  ));
}

export default class Layout extends React.Component {

  constructor() {
    super();
    this.state = {
      searchText: '',
    };
  }

  @throttle(200)
  onSearch(text) {
    this.state.searchText = text;
    this.forceUpdate();
  }

  render() {
    return (
      <div className='react-container'>
        <div className='header'>
          <div className='header-item header-title'>
            Holy Rulebook
          </div>
          <div className='header-item header-search'>
            <input
              placeholder='Search...'
              onChange={(e) => this.onSearch(e.target.value)} />
          </div>
        </div>
        <div className='sidebar'>
          <div className='sidebar-item sidebar-item-title'>
            Table of contents
          </div>
          {renderToc(toc)}
        </div>
        <div className='content'>
          {sections
            .filter((section) => {
              const title = section.title.toLowerCase();
              const query = this.state.searchText.toLowerCase();
              return title.includes(query);
            })
            .map((section) => <Section key={section._id} item={section} />)}
          <SkillCard item={acrobatics} />
          <SkillTable skills={skills} />
        </div>
      </div>
    );
  }

}

// TODO: routing (currently not needed)
// import { BrowserRouter, Route } from 'react-router-dom';
// import { Link } from 'react-router';

// const routes = (
//   <BrowserRouter
//     history={window.history}
//     onUpdate={() => window.scrollTo(0, 0)}>
//     <Route path='/' exact component={IndexPage} />
//   </BrowserRouter>
// );
