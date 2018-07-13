import React from 'react';
import { bindActionCreators } from 'redux';
import { flatConnect, actions, routerActions, selectors } from '../store';
import { mapValueToColorScale } from '../color.js';
import CharacterXpControl from './CharacterXpControl.jsx';
import { Editable } from '../widgets';

export default flatConnect(
  (state, props) => ({
    character: selectors.getCharacter(state, props.characterId),
    gameStateId: selectors.getCharacterGameStateId(state, props.characterId),
    charcs: selectors.getCharacterCharacteristics(state, props.characterId),
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    router: bindActionCreators(routerActions, dispatch),
  }),
  function CharacterCharcs(props) {
    const {
      characterId, character, gameStateId, charcs,
      actions, router,
    } = props;
    if (!character) {
      return null;
    }
    return (
      <div className="CharacteristicsView Layout__content-padding">
        <CharacterXpControl characterId={characterId} />
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
              <th>Starting</th>
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
                <td style={{ width: '4rem', background: '#fff8cc' }}>
                  <Editable
                    value={character.getIn(['charcs', charc.get('id')])}
                    onChange={value => {
                      const parsedValue = parseInt(value, 10);
                      if (!parsedValue || parsedValue < 0) {
                        return;
                      }
                      actions.updateCharacterValue(characterId,
                        ['charcs', charc.get('id')], parsedValue);
                    }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);
