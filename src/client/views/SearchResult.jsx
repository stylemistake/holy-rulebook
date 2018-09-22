import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {
  globalActions,
  routerActions,
  characterSelectors,
} from '../store';
import { connect } from 'react-redux';
import { Widget, Flex } from '../widgets';
import SkillSearchResult from './SkillSearchResult.jsx';
import ItemSearchResult from './ItemSearchResult.jsx';

export default class SearchResult extends Component {
  
  constructor(props) {
    super(props);
  }
  
  render(){
    if(this.props.category === 'skills'){
      return <SkillSearchResult {...this.props} />;
    } else if(this.props.category === 'items') {
      return <ItemSearchResult {...this.props} />;
    } else {
      return (<div className="">{this.props.category}</div>);
    }
  }
  
}