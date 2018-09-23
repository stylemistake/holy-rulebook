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
      <div className="">
        <Flex spreadChildren>
          {characters.map(character => (
            <CharacterSheetLite key={character.get('id')} characterId={character.get('id')} />
          ))}
        </Flex>
      </div>
    );
  }
);
