import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as selectors from '../../selectors.js';
import { mapValueToColorScale } from '../../color.js';

@connect(state => {
  return {
    character: selectors.getActiveCharacter(state),
  };
})
export default class CharacteristicsView extends Component {

  render() {
    const { params, character, dispatch } = this.props;
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
            {character.getCharacteristics().map(charc => (
              <tr key={charc.id}>
                <th>{charc.name}</th>
                <th className="GenericTable__statistic text-center">{charc.value}</th>
                <td className="clickable"
                  onClick={() => {
                    dispatch({
                      type: 'XP_REFUND_CHARACTERISTIC',
                      payload: {
                        id: charc.id,
                      },
                    });
                  }}>
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
                  onClick={() => {
                    dispatch({
                      type: 'XP_BUY_CHARACTERISTIC',
                      payload: {
                        id: charc.id,
                      },
                    });
                  }}>
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
