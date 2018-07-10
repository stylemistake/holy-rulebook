import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, routerActions, selectors, Character } from '../store';
import { mapValueToColorScale } from '../color.js';

import Breadcrumb from './Breadcrumb.jsx';

@connect((state, props) => ({
  character: selectors.getCharacter(state, props.characterId),
  gameStateId: selectors.getCharacterGameStateId(state, props.characterId),
}), dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  router: bindActionCreators(routerActions, dispatch),
}))
export default class CharacterCharcs extends Component {

  render() {
    const {
      characterId, character, gameStateId,
      actions, router,
    } = this.props;
    if (!character) {
      return null;
    }
    const charcs = Character.getCharacteristics(character);
    return (
      <div className="CharacteristicsView">
        <Breadcrumb router={router} padded
          items={[
            ['index'],
            ['gameState', { gameStateId }],
            ['character', { characterId }],
            ['character.charcs', { characterId }],
          ]} />
        <table className="GenericTable">
          <thead>
            <tr>
              <th>Characteristic</th>
              <th></th>
              <th></th>
              <th className="text-center">Cost</th>
              <th></th>
              <th>Aptitudes</th>
              <th><abbr title="Matching aptitudes">M</abbr></th>
            </tr>
          </thead>
          <tbody>
            {charcs.map(charc => (
              <tr key={charc.id}>
                <th>{charc.name}</th>
                <th className="GenericTable__statistic text-center">
                  {charc.value}
                </th>
                <td className="clickable"
                  onClick={() => actions.refundCharacteristic(characterId, charc.id)}>
                  <i className="icon minus fitted" />
                </td>
                <td className="text-center"
                  style={{
                    backgroundColor: mapValueToColorScale(charc.cost || 9999, {
                      green: 100,
                      yellow: 750,
                      red: 2500,
                    }),
                  }}>
                  {charc.cost || '--'}
                </td>
                <td className="clickable"
                  onClick={() => actions.buyCharacteristic(characterId, charc.id)}>
                  <i className="icon plus fitted" />
                </td>
                <td>{charc.aptitudes.join(', ')}</td>
                <td className="text-center">{charc.matchingApts}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <div className="ui button">
            Upgrade (-200XP)
          </div>
        </div>
      </div>
    );
  }

}
