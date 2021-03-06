import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, routerActions, selectors } from '../store';
import { Button, Dropdown } from 'semantic-ui-react';

const APTITUDE_LIST = [
  'Agility',
  'Ballistic Skill',
  'Defense',
  'Fellowship',
  'Fieldcraft',
  'Finesse',
  'Intelligence',
  'Knowledge',
  'Leadership',
  'Offense',
  'Perception',
  'Psyker',
  'Social',
  'Strength',
  'Tech',
  'Toughness',
  'Weapon Skill',
  'Willpower',
];

@connect((state, props) => ({
  character: selectors.getCharacter(state, props.characterId),
  gameStateId: selectors.getCharacterGameStateId(state, props.characterId),
}), dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  router: bindActionCreators(routerActions, dispatch),
}))
export default class CharacterAptitudes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  render() {
    const {
      characterId, character, gameStateId,
      actions, router,
    } = this.props;
    if (!character) {
      return null;
    }
    const aptitudes = character.get('aptitudes');
    const options = APTITUDE_LIST
      .filter(x => !aptitudes.includes(x))
      .map(x => ({ text: x, value: x }));
    return (
      <div className="Layout__content-padding">
        <table className="GenericTable">
          <thead>
            <tr>
              <th>Aptitudes</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {aptitudes.map((name) => (
              <tr key={name}>
                <td>{name}</td>
                <td className="cursor-pointer"
                  onClick={() => actions.removeAptitude(characterId, name)}>
                  <i className="icon delete fitted" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ui divider" />
        <Dropdown selection
          placeholder="Aptitude"
          options={options}
          value={this.state.value}
          onChange={(e, data) => {
            this.setState({ value: data.value });
          }} />
        <Button content="Grant"
          onClick={() => {
            const value = this.state.value;
            if (!value) {
              return;
            }
            if (aptitudes.includes(value)) {
              return;
            }
            actions.addAptitude(characterId, value);
            this.setState({ value: '' });
          }} />
      </div>
    );
  }

}
