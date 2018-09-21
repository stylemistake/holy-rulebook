import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {
  globalActions,
  routerActions,
  characterSelectors,
} from '../store';
import { connect } from 'react-redux';
import { Widget, Flex } from '../widgets';
import { Dropdown } from 'semantic-ui-react'

@connect((state, props) => ({
  results: state.get('searchResults'),
}),
dispatch => ({
  actions: bindActionCreators(globalActions, dispatch),
  router: bindActionCreators(routerActions, dispatch),
}))
export default class Search extends Component {
  
  constructor(props) {
    super(props);
  }
  
  render(){
    const {
      results,
      actions
    } = this.props;
    return (
      <Dropdown placeholder="Search..." onSearchChange={(e) => actions.searchQuery(e.target.value)} fluid search selection options={results || []} />
    );
  }
  
}