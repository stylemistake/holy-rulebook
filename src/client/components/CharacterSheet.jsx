import React from 'react';
import Markdown from 'react-remarkable';
import { classes } from '../lib/utils.js';
import store from '../lib/store.js';
import {
  Widget, Flex, ValueWidget, ListWidget, ListWidgetItem, TextWidget,
} from './widgets';

const SKILL_TIERS = ['-20', '', '+10', '+20', '+30', '+40'];

export default class CharacterSheet extends React.Component {

  /**
   * Returns an onChange handler
   */
  getStateUpdater(stateObj, key) {
    return (value) => {
      stateObj[key] = value;
      store.dispatch();
    };
  }

  render() {
    const { character } = this.props;
    const cstate = character.state;
    return <Widget macro={true}>
      <ValueWidget title="Character name"
        value={character.name}
        onChange={this.getStateUpdater(character, 'name')} />
      <Flex spread={true}>
        <ValueWidget title="Damage" color="red"
          value={cstate.damage}
          onChange={this.getStateUpdater(cstate, 'damage')} />
        <ValueWidget title="Fatigue" color="orange"
          value={cstate.fatigue}
          onChange={this.getStateUpdater(cstate, 'fatigue')} />
        <ValueWidget title="Corruption" color="yellow"
          value={cstate.corruption}
          onChange={this.getStateUpdater(cstate, 'corruption')} />
        <ValueWidget title="Stress" color="green"
          value={cstate.stress}
          onChange={this.getStateUpdater(cstate, 'stress')} />
        <ValueWidget title="Fate" color="teal"
          value={cstate.fate}
          onChange={this.getStateUpdater(cstate, 'fate')} />
        <ValueWidget title="XP" color="blue"
          value={cstate.experience}
          onChange={this.getStateUpdater(cstate, 'experience')} />
      </Flex>
      <Flex>
        <ListWidget title="Skills">
          {character.getSkills().map((x) => {
            return <ListWidgetItem
              key={x.name}
              name={x.name}
              value={SKILL_TIERS[x.tier]} />;
          })}
        </ListWidget>
        <TextWidget title="Notes" color="purple" flex={true}>
          Hello world!
        </TextWidget>
      </Flex>
    </Widget>;
  }

}
