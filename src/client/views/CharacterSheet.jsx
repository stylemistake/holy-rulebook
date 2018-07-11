import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, routerActions, selectors } from '../store';
import {
  Widget, Flex, ValueWidget, TableWidget, TextWidget,
} from '../widgets';

import Breadcrumb from './Breadcrumb.jsx';

@connect((state, props) => ({
  character: selectors.getCharacter(state, props.characterId),
  gameStateId: selectors.getCharacterGameStateId(state, props.characterId),
  charcs: selectors.getCharacterCharacteristics(state, props.characterId),
  skills: selectors.getCharacterSkills(state, props.characterId)
    .filter(skill => skill.get('tier') > 0),
  availableXp: selectors.getCharacterAvailableXp(state, props.characterId),
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
      characterId, character, gameStateId, charcs, skills, availableXp,
      actions, router,
    } = this.props;
    if (!character) {
      return null;
    }
    const aptitudes = character.get('aptitudes');
    return <div style={{ maxWidth: '64rem', minWidth: '48rem' }}>
      <Breadcrumb router={router}
        items={[
          ['index'],
          ['gameState', { gameStateId }],
          ['character', { characterId }],
        ]} />
      <ValueWidget
        title="Character name"
        value={character.get('name')}
        onChange={this.getValueUpdater(['name'])} />
      <Flex spreadChildren>
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
          value={availableXp}
          onClick={() => {
            router.navigateTo('character.xp', { characterId });
          }} />
        <ValueWidget title="Influence"
          value={character.getIn(['state', 'influence'])}
          onChange={this.getValueUpdater(['state', 'influence'])} />
      </Flex>
      <Flex>
        <TableWidget title="Characteristics"
          onClick={() => {
            router.navigateTo('character.charcs', { characterId });
          }}>
          {charcs.map(charc => (
            <TableWidget.Row key={charc.get('id')}>
              <TableWidget.Cell content={charc.get('name')} />
              <TableWidget.Cell content={charc.get('id')} />
              <TableWidget.Cell content={charc.get('value')} />
            </TableWidget.Row>
          ))}
        </TableWidget>
        <TableWidget title="Aptitudes"
          onClick={() => {
            router.navigateTo('character.aptitudes', { characterId });
          }}>
          {aptitudes.map(x => (
            <TableWidget.SimpleItem key={x} itemName={x} />
          ))}
        </TableWidget>
        <TextWidget title="Notes" color="purple" fluid>
          Hello world!
        </TextWidget>
      </Flex>
      <Flex>
        <TableWidget title="Skills" color="red" fluid
          onClick={() => {
            router.navigateTo('character.skills', { characterId });
          }}>
          {skills.map(skill => (
            <TableWidget.Row key={skill.hashCode()}>
              <TableWidget.Cell content={skill.get('displayName')} />
              <TableWidget.Cell content={'Tier: ' + skill.get('tier')} />
              <TableWidget.Cell>
                {skill.get('characteristic')}:
                +{skill.get('bonus')}
              </TableWidget.Cell>
            </TableWidget.Row>
          ))}
        </TableWidget>
      </Flex>
    </div>;
  }

}
