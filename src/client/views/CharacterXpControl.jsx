import React from 'react';
import { bindActionCreators } from 'redux';
import { flatConnect, actions, selectors } from '../store';
import { Checkbox } from 'semantic-ui-react';

export default flatConnect(
  (state, props) => ({
    character: selectors.getCharacter(state, props.characterId),
    availableXp: selectors.getCharacterAvailableXp(state, props.characterId),
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
  function CharacterXp(props) {
    const {
      characterId, character, availableXp,
      actions,
    } = props;
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
                <Checkbox
                  checked={character.get('xpFrozen')}
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
);
