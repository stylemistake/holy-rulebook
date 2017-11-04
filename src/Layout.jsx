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
import { queryEntity } from './lib/entityStore.js';

const acrobatics = queryEntity('/skills/acrobatics');

const Aux = (props) => props.children;
const kitchenSink = (
  <Aux>
    <SkillCard skill={acrobatics} />
  </Aux>
);

export default class Layout extends React.Component {

  render() {
    return (
      <div className='react-container'>
        <div className='header'>
          Header
        </div>
        <div className='content'>
          {kitchenSink}
        </div>
      </div>
    );
  }

}
