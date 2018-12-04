import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {
  globalActions,
  routerActions,
  characterSelectors,
} from '../store';
import { connect } from 'react-redux';
import { Widget, Flex } from '../widgets';

export default class TalentSearchResult extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { character, actions, item, state, characterCharacteristics } = this.props;
    const characterTalent = character
      && characterSelectors.getCharacterTalent(state, item, character)
      || null;
    return (<div className="ui grid">
      <div className="row">
        <div className="twelve wide column">
          <div>{this.props.item.get('name')}</div>
        </div>
      </div>
      <div className="row">
        <div className="twelve wide column" dangerouslySetInnerHTML={{ __html: this.props.item.get('description') }}></div>
        {this.props.item.get('examples') && <div className="four wide column">
          {this.props.item.get('examples').map((example, index) => {
            return <div key={index} dangerouslySetInnerHTML={{ __html: example }}></div>;
          })}
        </div>}
        {character && <div className="twelve wide column">
          {character.get('name')}: <div className="ui button basic compact fitted icon green"
            onClick={() => actions.buyTalent(character.get('id'), item.get('name'), item.get('specialization'), characterTalent.get('cost'))}>
            Add
        </div>
        </div>}
      </div>
    </div>);
  }

}