import React, { Component, Fragment } from 'react';
import Markdown from 'react-remarkable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, routerActions, selectors, Character } from '../store';
import {
  Widget, Flex, ValueWidget, ListWidget, ListWidgetItem, TextWidget,
} from '../widgets';

import Breadcrumb from './Breadcrumb.jsx';

const SKILL_TIERS = ['-20', '', '+10', '+20', '+30', '+40'];

@connect((state, props) => ({
  character: selectors.getCharacter(state, props.characterId),
  gameStateId: selectors.getCharacterGameStateId(state, props.characterId),
  skills: selectors.getCharacterSkills(state),
}), dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  router: bindActionCreators(routerActions, dispatch),
}))
export default class CharacterSheet extends Component {

  /**
   * Returns an onChange handler
   */
  getValueUpdater(path) {
    const { characterId, actions } = this.props;
    return value => actions.updateCharacterValue(characterId, path, value);
  }

  render() {
    const {
      characterId, character, gameStateId, skills,
      actions, router,
    } = this.props;
    if (!character) {
      return null;
    }
    const characteristics = Character.getCharacteristics(character);
    const aptitudes = character.get('aptitudes');
    return <div style={{ maxWidth: '64rem', minWidth: '48rem' }}>
      <Breadcrumb router={router} padded
        items={[
          ['index'],
          ['gameState', { gameStateId }],
          ['character', { characterId }],
        ]} />
      <ValueWidget
        title="Character name"
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
          onClick={() => {
            router.navigateTo('character.xp', { characterId });
          }} />
        <ValueWidget title="Influence"
          value={character.getIn(['state', 'influence'])}
          onChange={this.getValueUpdater(['state', 'influence'])} />
      </Flex>
      <Flex>
        <ListWidget title="Characteristics"
          onClick={() => {
            router.navigateTo('character.charcs', { characterId });
          }}>
          {characteristics.map(charc => {
            return <ListWidgetItem
              key={charc.id}
              name={charc.name}
              value={charc.value} />;
          })}
        </ListWidget>
        <ListWidget title="Aptitudes"
          onClick={() => {
            router.navigateTo('character.aptitudes', { characterId });
          }}>
          {aptitudes.map(x => {
            return <ListWidgetItem key={x} name={x} />;
          })}
        </ListWidget>
        {/*
        <ListWidget title="Skills"
          onClick={() => {
            router.navigateTo('character.skills', { characterId });
          }}>
          {skills.map(x => {
            return <ListWidgetItem key={x} name={x} />;
          })}
        </ListWidget>
        */}
        <TextWidget title="Notes" color="purple" flex={true}>
          Hello world!
        </TextWidget>
      </Flex>
    </div>;
  }

}
