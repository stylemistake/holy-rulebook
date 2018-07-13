import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, routerActions, selectors, Character } from '../store';
import { mapValueToColorScale } from '../color.js';

import Breadcrumb from './Breadcrumb.jsx';
import CharacterXpControl from './CharacterXpControl.jsx';

@connect((state, props) => ({
  character: selectors.getCharacter(state, props.characterId),
  gameStateId: selectors.getCharacterGameStateId(state, props.characterId),
  skills: selectors.getCharacterSkills(state, props.characterId)
    .sortBy(skill => -skill.get('matchingApts')),
}), dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  router: bindActionCreators(routerActions, dispatch),
}))
export default class CharacterSkills extends Component {

  render() {
    const {
      characterId, character, gameStateId, skills,
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
            ['character.skills', { characterId }],
          ]} />
        <div className="Layout__content-padding">
          <CharacterXpControl characterId={characterId} />
          <table className="GenericTable">
            <thead>
              <tr>
                <th>Skill</th>
                <th><abbr title="Tier">T</abbr></th>
                <th></th>
                <th className="text-center">Cost</th>
                <th></th>
                <th>Aptitudes</th>
                <th><abbr title="Matching aptitudes">M</abbr></th>
              </tr>
            </thead>
            <tbody>
              {skills.map(skill => (
                <tr key={skill.hashCode()}>
                  <th>{skill.get('displayName')}</th>
                  <th className="GenericTable__statistic text-center">
                    {skill.get('purchaseCount')}
                  </th>
                  <td className="clickable"
                    onClick={() => {
                      actions.refundSkill(characterId,
                        skill.get('name'),
                        skill.get('specialization'));
                    }}>
                    <i className="icon minus fitted" />
                  </td>
                  <td className="text-center"
                    style={{
                      backgroundColor: mapValueToColorScale(skill.get('cost') || 9999, {
                        green: 100,
                        yellow: 750,
                        red: 2500,
                      }),
                    }}>
                    {skill.get('cost') || '--'}
                  </td>
                  <td className="clickable"
                    onClick={() => {
                      actions.buySkill(characterId,
                        skill.get('name'),
                        skill.get('specialization'),
                        skill.get('cost'));
                    }}>
                    <i className="icon plus fitted" />
                  </td>
                  <td>{skill.get('aptitudes').join(', ')}</td>
                  <td className="text-center">{skill.get('matchingApts')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }

}
