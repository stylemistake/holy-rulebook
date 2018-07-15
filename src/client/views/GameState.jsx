import React from 'react';
import { bindActionCreators } from 'redux';
import { flatConnect, actions, routerActions, selectors } from '../store';

import { Widget, Flex } from '../widgets';
import CharacterSheetLite from './CharacterSheetLite.jsx';

export default flatConnect(
  (state, props) => ({
    gameState: selectors.getGameState(state, props.gameStateId),
    characters: selectors.getGameStateCharacters(state, props.gameStateId),
  }), dispatch => ({
    router: bindActionCreators(routerActions, dispatch),
    actions: bindActionCreators(actions, dispatch),
  }),
  function GameState(props) {
    const {
      gameState, gameStateId, characters,
      router, actions,
    } = props;
    if (!gameState) {
      return null;
    }
    return (
      <div className="Layout__content-padding">
        <div className="ui menu" colSpan="2">
          <div className="item">Characters</div>
          <div className="menu right">
            <div className="item">
              <div className="ui button compact fitted icon labeled black"
                onClick={() => actions.createCharacter(gameStateId)}>
                <i className="icon plus" />
                Create new character
              </div>
            </div>
          </div>
        </div>
        <table className="ui table unstackable striped selectable">
          <tbody>
            {characters.map(character => {
              const characterId = character.get('id');
              return (
                <tr key={characterId}
                  className="cursor-pointer">
                  <td
                    onClick={() => {
                      router.navigateTo('character', { characterId });
                    }}>
                    <i className="icon id card" />
                    {character.get('name')}
                  </td>
                  <td className="text-right">
                    <div className="ui button basic compact fitted icon red"
                      onClick={() => actions.removeCharacter(characterId)}>
                      <i className="icon remove" />
                    </div>
                  </td>
                </tr>
              );
            })}
            {characters.size === 0 && (
              <tr>
                <td colSpan="2" className="text-center">No items</td>
              </tr>
            )}
          </tbody>
        </table>
        <Flex spreadChildren>
          {characters.map(character => (
            <CharacterSheetLite characterId={character.get('id')} />
          ))}
        </Flex>
      </div>
    );
  }
);
