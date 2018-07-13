import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, routerActions, selectors } from '../store';
import { Checkbox } from 'semantic-ui-react';

@connect((state, props) => ({
  character: selectors.getCharacter(state, props.characterId),
  availableXp: selectors.getCharacterAvailableXp(state, props.characterId),
}), dispatch => ({
  actions: bindActionCreators(actions, dispatch),
}))
export default class CharacterXp extends Component {

  render() {
    const {
      characterId, character, availableXp,
      actions,
    } = this.props;
    if (!character) {
      return null;
    }
    return (
      <div>
        <table className="GenericTable">
          <tbody>
            <tr>
              <th>Freeze XP:</th>
              <th>
                <Checkbox checked={character.get('xpFrozen')}
                  onChange={(e, data) => {
                    actions.toggleXpFreeze(characterId, data.checked);
                  }} />
              </th>
            </tr>
            <tr>
              <th>Available XP:</th>
              <th>{availableXp}</th>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

}
