'use strict';

import React from 'react';

// import { BrowserRouter, Route } from 'react-router-dom';
// import { Link } from 'react-router';

// const routes = (
//   <BrowserRouter
//     history={window.history}
//     onUpdate={() => window.scrollTo(0, 0)}>
//     <Route path='/' exact component={IndexPage} />
//   </BrowserRouter>
// );

import SkillCard from './components/SkillCard.jsx';
import Section from './components/Section.jsx';
import Store from './lib/Store.js';

const acrobatics = Store.query('/skills/acrobatics');
const sections = Store.queryAll('/sections/skills');

const Aux = (props) => props.children;
const kitchenSink = (
  <Aux>
    {sections.map((section, i) => <Section key={i} item={section} />)}
    <SkillCard item={acrobatics} />
  </Aux>
);

export default class Layout extends React.Component {

  render() {
    return (
      <div className='react-container'>
        <div className='header'>
          <div className='header-item header-title'>
            Holy Rulebook
          </div>
          <div className='header-item header-search'>
            <input placeholder='Search...' />
          </div>
        </div>
        <div className='content'>
          {kitchenSink}
        </div>
      </div>
    );
  }

}
