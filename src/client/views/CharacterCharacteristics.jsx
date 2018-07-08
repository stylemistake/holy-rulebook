import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, selectors, Character } from '../state';
import { mapValueToColorScale } from '../color.js';

@connect(state => ({
  character: selectors.getActiveCharacter(state),
  // TODO: Move characterId to props
  characterId: state.get('activeCharacterId'),
}), dispatch => ({
  actions: bindActionCreators(actions, dispatch),
}))
export default class CharacterCharacteristics extends Component {

  render() {
    const { actions, params, character, characterId } = this.props;
    const characteristics = Character.getCharacteristics(character);
    return (
      <div className="CharacteristicsView">
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
            {characteristics.map(charc => (
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
