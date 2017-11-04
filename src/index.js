'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './Layout.jsx';

import './styles/index.scss';

window.addEventListener('load', () => {
  const element = document.querySelector('.react-root');
  ReactDOM.render(<Layout />, element);
});
