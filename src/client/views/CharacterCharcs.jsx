import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, routerActions, selectors } from '../store';
import { mapValueToColorScale } from '../color.js';

import Breadcrumb from './Breadcrumb.jsx';

@connect((state, props) => ({
  character: selectors.getCharacter(state, props.characterId),
  gameStateId: selectors.getCharacterGameStateId(state, props.characterId),
  charcs: selectors.getCharacterCharacteristics(state, props.characterId),
}), dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  router: bindActionCreators(routerActions, dispatch),
}))
export default class CharacterCharcs extends Component {

  render() {
    const {
      characterId, character, gameStateId, charcs,
      actions, router,
    } = this.props;
    if (!character) {
      return null;
    }
    return (
      <Fragment>
        <Breadcrumb router={router}
          items={[
            ['index'],
            ['gameState', { gameStateId }],
            ['character', { characterId }],
            ['character.charcs', { characterId }],
          ]} />
        <div className="CharacteristicsView Layout__content-padding">
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
                <tr key={charc.get('id')}>
                  <th>{charc.get('name')}</th>
                  <th className="GenericTable__statistic text-center">
                    {charc.get('value')}
                  </th>
                  <td className="clickable"
                    onClick={() => {
                      actions.refundCharacteristic(characterId, charc.get('id'));
                    }}>
                    <i className="icon minus fitted" />
                  </td>
                  <td className="text-center"
                    style={{
                      backgroundColor: mapValueToColorScale(charc.get('cost') || 9999, {
                        green: 100,
                        yellow: 750,
                        red: 2500,
                      }),
                    }}>
                    {charc.get('cost') || '--'}
                  </td>
                  <td className="clickable"
                    onClick={() => {
                      actions.buyCharacteristic(characterId, charc.get('id'), charc.get('cost'));
                    }}>
                    <i className="icon plus fitted" />
                  </td>
                  <td>{charc.get('aptitudes').join(', ')}</td>
                  <td className="text-center">{charc.get('matchingApts')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }

}
