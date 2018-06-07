import React, { PureComponent, Fragment } from 'react';
import Markdown from 'react-remarkable';
import { connect } from 'react-redux';
import {
  Widget, Flex, ValueWidget, ListWidget, ListWidgetItem, TextWidget,
} from './widgets';
import * as actions from '../actions.js';
import * as queries from '../queries.js';

const SKILL_TIERS = ['-20', '', '+10', '+20', '+30', '+40'];

@connect()
export default class CharacterSheet extends PureComponent {

  /**
   * Returns an onChange handler
   */
  getStateUpdater(path) {
    return (value) => {
      const id = this.props.character.get('id');
      this.props.dispatch(actions.updateCharacterValue(id, path, value));
    };
  }

  render() {
    const { character } = this.props;
    const cstate = character.get('state');
    return <Fragment>
      <ValueWidget title="Character name"
        value={character.get('name')}
        onChange={this.getStateUpdater(['name'])} />
      <Flex spread={true}>
        <ValueWidget title="Damage" color="red"
          value={cstate.get('damage')}
          onChange={this.getStateUpdater(['state', 'damage'])} />
        <ValueWidget title="Fatigue" color="orange"
          value={cstate.get('fatigue')}
          onChange={this.getStateUpdater(['state', 'fatigue'])} />
        <ValueWidget title="Corruption" color="yellow"
          value={cstate.get('corruption')}
          onChange={this.getStateUpdater(['state', 'corruption'])} />
        <ValueWidget title="Stress" color="green"
          value={cstate.get('stress')}
          onChange={this.getStateUpdater(['state', 'stress'])} />
        <ValueWidget title="Fate" color="teal"
          value={cstate.get('fate')}
          onChange={this.getStateUpdater(['state', 'fate'])} />
        <ValueWidget title="XP" color="blue"
          value={cstate.get('experience')}
          onChange={this.getStateUpdater(['state', 'experience'])} />
      </Flex>
      <Flex>
        <ListWidget title="Characteristics">
          {queries.getCharacterCharcs(character).map((x) => {
            return <ListWidgetItem
              key={x.get('id')}
              name={x.get('name')}
              value={x.get('value')}
              onClick={() => {
                // TODO: Move this to actions
                this.props.dispatch({
                  type: 'SELECT_CHARACTERISTIC',
                  charc: x,
                });
              }} />;
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
