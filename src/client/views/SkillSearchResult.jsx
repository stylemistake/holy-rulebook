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

  render() {
    const { character, actions, item, state, characterCharacteristics } = this.props;
    const characterSkill = character
      && characterSelectors.getCharacterSkill(state, item, character, characterCharacteristics)
      || null;
    return (<div className="ui grid">
      <div className="row">
        <div className="twelve wide column">
          <div>{item.get('displayName') || item.get('name')}</div>
        </div>
      </div>
      <div className="row">
        <div className="twelve wide column" dangerouslySetInnerHTML={{ __html: item.get('description') }}></div>
        <div className="four wide column">
        {item.get('examples').map((example, index) => {
            return <div key={index} dangerouslySetInnerHTML={{ __html: example }}></div>;
          })}
        </div>
      </div>
      {character && <div className="twelve wide column">
        {character.get('name')}: <div className="ui button basic compact fitted icon green"
          onClick={() => actions.buySkill(character.get('id'), item.get('name'), item.get('specialization'), characterSkill.get('cost'))}>
          Add
        </div>
      </div>}
    </div>);
  }

}
