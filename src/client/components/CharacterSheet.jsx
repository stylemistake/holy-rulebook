import React, { PureComponent, Fragment } from 'react';
import Markdown from 'react-remarkable';
import { connect } from 'react-redux';
import {
  Widget, Flex, ValueWidget, ListWidget, ListWidgetItem, TextWidget,
} from './widgets';
import * as actions from '../actions.js';
import * as selectors from '../selectors.js';

const SKILL_TIERS = ['-20', '', '+10', '+20', '+30', '+40'];

@connect()
export default class CharacterSheet extends PureComponent {

  /**
   * Returns an onChange handler
   */
  getValueUpdater(path) {
    const { character, dispatch } = this.props;
    return (value) => {
      const id = character.get('id');
      dispatch(actions.updateCharacterValue(id, path, value));
    };
  }

  render() {
    const { character, dispatch } = this.props;
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
          value={character.getAvailableXp()}
          onClick={() => dispatch(actions.openDetailsPane('xp'))} />
        <ValueWidget title="Influence"
          value={character.getIn(['state', 'influence'])}
          onChange={this.getValueUpdater(['state', 'influence'])} />
      </Flex>
      <Flex>
        <ListWidget title="Characteristics"
          onClick={() => {
            dispatch(actions.openDetailsPane('characteristics'));
          }}>
          {character.getCharacteristics().map(charc => {
            return <ListWidgetItem
              key={charc.id}
              name={charc.name}
              value={charc.value} />;
          })}
        </ListWidget>
        <ListWidget title="Aptitudes"
          onClick={() => {
            dispatch(actions.openDetailsPane('aptitudes'));
          }}>
          {character.get('aptitudes').map(x => {
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
