import React from 'react';
import { bindActionCreators } from 'redux';
import { flatConnect, actions, routerActions, selectors } from '../store';

export default flatConnect(
  state => ({
    gameStates: selectors.getGameStates(state),
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    router: bindActionCreators(routerActions, dispatch),
  }),
  function IndexPage(props) {
    const { gameStates, actions, router } = props;
    return (
      <div className="Layout__content-padding">
        <table className="ui table unstackable striped selectable">
          <tbody>
            {gameStates.map(gameState => {
              const gameStateId = gameState.get('id');
              return (
                <tr key={gameState.get('id')}
                  className="cursor-pointer"
                  onClick={() => {
                    router.navigateTo('gameState', { gameStateId });
                  }}>
                  <td>
                    <i className="icon folder" />
                    GameState [{gameStateId.substr(0, 7)}]
                  </td>
                  <td className="text-right">
                    {gameState.get('characters').size} characters
                  </td>
                </tr>
              );
            })}
            {gameStates.size === 0 && (
              <tr>
                <td colSpan="2" className="text-center">No items</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
);
