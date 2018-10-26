import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {
  globalActions,
  routerActions,
  characterSelectors,
} from '../store';
import { connect } from 'react-redux';
import { Widget, Flex } from '../widgets';

export default class SkillSearchResult extends Component {

  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div className="ui grid">
        <div className="row">
          <div className="twelve wide column"
            style={{ whiteSpace: 'pre' }}>
            {this.props.item.get('name')}
          </div>
        </div>
        <div className="row">
          <div className="twelve wide column"
            style={{ whiteSpace: 'pre' }}>
            {this.props.item.get('description')}
          </div>
          <div className="four wide column"
            style={{ whiteSpace: 'pre' }}>
            {this.props.item.get('examples')}
          </div>
        </div>
      </div>
    );
  }

}
