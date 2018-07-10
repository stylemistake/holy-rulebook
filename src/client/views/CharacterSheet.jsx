import React, { Component, Fragment } from 'react';
import Markdown from 'react-remarkable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, selectors, Character } from '../store';
import {
  Widget, Flex, ValueWidget, ListWidget, ListWidgetItem, TextWidget,
} from '../widgets';

const SKILL_TIERS = ['-20', '', '+10', '+20', '+30', '+40'];

@connect((state, props) => ({
  character: selectors.getCharacter(state, props.characterId),
}), dispatch => ({
  actions: bindActionCreators(actions, dispatch),
}))
export default class CharacterSheet extends Component {

  /**
   * Returns an onChange handler
   */
  getValueUpdater(path) {
    const { character, actions } = this.props;
    return (value) => {
      const characterId = character.get('id');
      actions.updateCharacterValue(characterId, path, value);
    };
  }

  render() {
    const { character, actions } = this.props;
    const characteristics = Character.getCharacteristics(character);
    const aptitudes = character.get('aptitudes');
    return <Fragment>
      <ValueWidget title="Character name"
        value={character.get('name')}
        onChange={this.getValueUpdater(['name'])} />
      <Flex spread={true}>
        <ValueWidget title="Wounds" color="red"
          value={character.getIn(['state', 'wounds'])}
          onChange={this.getValueUpdater(['state', 'wounds'])} />
        <ValueWidget title="Fatigue" color="orange"
          value={character.getIn(['state', 'fatigue'])}
          onChange={this.getValueUpdater(['state', 'fatigue'])} />
        <ValueWidget title="Corrup." color="yellow"
          value={character.getIn(['state', 'corruption'])}
          onChange={this.getValueUpdater(['state', 'corruption'])} />
        <ValueWidget title="Stress" color="green"
          value={character.getIn(['state', 'stress'])}
          onChange={this.getValueUpdater(['state', 'stress'])} />
        <ValueWidget title="Fate" color="teal"
          value={character.getIn(['state', 'fate'])}
          onChange={this.getValueUpdater(['state', 'fate'])} />
        <ValueWidget title="XP" color="blue"
          editable={false}
          value={Character.getAvailableXp(character)}
          onClick={() => actions.openDetailsPane('xp')} />
        <ValueWidget title="Influence"
          value={character.getIn(['state', 'influence'])}
          onChange={this.getValueUpdater(['state', 'influence'])} />
      </Flex>
      <Flex>
        <ListWidget title="Characteristics"
          onClick={() => actions.openDetailsPane('characteristics')}>
          {characteristics.map(charc => {
            return <ListWidgetItem
              key={charc.id}
              name={charc.name}
              value={charc.value} />;
          })}
        </ListWidget>
        <ListWidget title="Aptitudes"
          onClick={() => actions.openDetailsPane('aptitudes')}>
          {aptitudes.map(x => {
            return <ListWidgetItem key={x} name={x} />;
          })}
        </ListWidget>
        {/*
        <ListWidget title="Skills">
          {character.getSkills().map((x) => {
            return <ListWidgetItem
              key={x.name}
              name={x.name}
              value={SKILL_TIERS[x.tier]} />;
          })}
        </ListWidget>
        */}
        <TextWidget title="Notes" color="purple" flex={true}>
          Hello world!
        </TextWidget>
      </Flex>
    </Fragment>;
  }

}
