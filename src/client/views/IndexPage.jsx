import React from 'react';
import { bindActionCreators } from 'redux';
import { connect, actions, routerActions, selectors } from '../store';

export default connect(
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
        <div className="ui menu" colSpan="2">
          <div class="item">Game states</div>
          <div class="menu right">
            <div class="item">
              <div className="ui button compact fitted icon labeled black"
                onClick={() => actions.createGameState()}>
                <i className="icon plus" />
                Create new gamestate
              </div>
            </div>
          </div>
        </div>
        <table className="ui table unstackable striped selectable">
          <tbody>
            {gameStates.map(gameState => {
              const gameStateId = gameState.get('id');
              return (
                <tr key={gameState.get('id')}
                  className="clickable"
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
