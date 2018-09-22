import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {
  globalActions,
  routerActions,
  characterSelectors,
} from '../store';
import { connect } from 'react-redux';
import { Widget, Flex } from '../widgets';
import SearchResult from './SearchResult.jsx';

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
    return (<div className="ui category search fluid">
      <div className="ui icon input fluid">
        <input className="prompt" type="text" placeholder="Search..." onChange={(e) => actions.searchQuery(e.target.value)} />
        <i className="search icon"></i>
      </div>
      <div 
        className={"results" + (results && results.length && " transition visible" || "")} 
        style={{
          overflowY: 'auto',
          maxHeight: '80vh'
        }}
        onBlur={(e) => {actions.searchQuery('');console.log('sds');}}
      >
      {results && results.map((result, index)=> {
        return (<div key={result.key} className="result">
          <SearchResult {...result}/>
        </div>);
      })}
      </div>
    </div>);
  }
  
}