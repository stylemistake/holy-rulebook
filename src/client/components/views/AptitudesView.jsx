import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown, Icon } from 'semantic-ui-react';
import * as selectors from '../../selectors.js';

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

@connect(state => {
  return {
    character: selectors.getActiveCharacter(state),
  };
})
export default class AptitudeView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  render() {
    const { dispatch, params, character } = this.props;
    const aptitudes = character.get('aptitudes');
    const options = APTITUDE_LIST
      .filter(x => !aptitudes.includes(x))
      .map(x => ({ text: x, value: x }));
    return (
      <div>
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
                <td className="clickable"
                  onClick={() => {
                    dispatch({
                      type: 'APTITUDE_REMOVE',
                      payload: { name },
                    });
                  }}>
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
            dispatch({
              type: 'APTITUDE_APPEND',
              payload: { name: value },
            });
            this.setState({ value: '' });
          }} />
      </div>
    );
  }

}
