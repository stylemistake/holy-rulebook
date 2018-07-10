import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, routerActions, selectors } from '../store';

import Breadcrumb from './Breadcrumb.jsx';

@connect(state => ({
  gameStates: selectors.getGameStates(state),
}), dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  router: bindActionCreators(routerActions, dispatch),
}))
export default class IndexPage extends Component {

  render() {
    const { gameStates, actions, router } = this.props;
    return (
      <div>
        <Breadcrumb router={router}
          items={[
            ['index'],
          ]} />
        <table className="ui table unstackable striped selectable">
          <thead>
            <tr>
              <th>Game States</th>
              <th className="collapsing text-right">
                <div className="ui button compact fitted icon labeled black"
                  onClick={() => actions.createGameState()}>
                  <i className="icon plus" />
                  Create new gamestate
                </div>
              </th>
            </tr>
          </thead>
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

}
