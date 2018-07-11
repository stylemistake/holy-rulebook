import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, routerActions, selectors } from '../store';

import Breadcrumb from './Breadcrumb.jsx';

@connect((state, props) => ({
  gameState: selectors.getGameState(state, props.gameStateId),
  characters: selectors.getGameStateCharacters(state, props.gameStateId),
}), dispatch => ({
  router: bindActionCreators(actions, dispatch),
  actions: bindActionCreators(actions, dispatch),
}))
export default class IndexPage extends Component {

  render() {
    const {
      gameState, gameStateId, characters,
      router, actions,
    } = this.props;
    if (!gameState) {
      return null;
    }
    return (
      <Fragment>
        <Breadcrumb router={router}
          items={[
            ['index'],
            ['gameState', { gameStateId }],
          ]} />
        <div className="Layout__content-padding">
          <table className="ui table unstackable striped selectable">
            <thead>
              <tr>
                <th>Characters</th>
                <th className="collapsing text-right">
                  <div className="ui button compact fitted icon labeled black"
                    onClick={() => actions.createCharacter(gameStateId)}>
                    <i className="icon plus" />
                    Create new character
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {characters.map(character => {
                const characterId = character.get('id');
                return (
                  <tr key={characterId}
                    className="clickable"
                    onClick={() => {
                      router.navigateTo('character', { characterId });
                    }}>
                    <td>
                      <i className="icon id card" />
                      {character.get('name')}
                    </td>
                    <td />
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
        </div>
      </Fragment>
    );
  }

}
