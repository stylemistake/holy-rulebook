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
import TalentSearchResult from './TalentSearchResult.jsx';
import WeaponSearchResult from './WeaponSearchResult.jsx';

export default class SearchResult extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.category === 'skills') {
      return <SkillSearchResult {...this.props} />;
    } else if (this.props.category === 'items') {
      if (this.props.item.get('tags') && this.props.item.get('tags').indexOf('Weapon') >= 0) {
        return <WeaponSearchResult {...this.props} />;
      } else {
        return <ItemSearchResult {...this.props} />;
      }
    } else if (this.props.category === 'talents') {
      return <TalentSearchResult {...this.props} />;
    } else {
      return (<div className="">{this.props.category}</div>);
    }
  }

}