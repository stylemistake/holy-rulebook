import React from 'react';
import { bindActionCreators } from 'redux';
import { flatConnect, actions, routerActions, selectors } from '../store';
import { mapValueToColorScale } from '../color.js';
import { classes } from '../utils.js';
import CharacterXpControl from './CharacterXpControl.jsx';

export default flatConnect(
  (state, props) => ({
    character: selectors.getCharacter(state, props.characterId),
    gameStateId: selectors.getCharacterGameStateId(state, props.characterId),
    skills: selectors.getCharacterSkills(state, props.characterId)
      .sortBy(skill => -skill.get('matchingApts')),
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    router: bindActionCreators(routerActions, dispatch),
  }),
  function CharacterSkills(props) {
    const {
      characterId, character, gameStateId, skills,
      actions, router,
    } = props;
    if (!character) {
      return null;
    }
    return (
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
              <tr key={skill.hashCode()}
                className={classes({
                  'GenericTable__row--dimmed': skill.get('purchaseCount') === 0,
                  'GenericTable__row--highlighted': skill.get('purchaseCount') > 0,
                })}>
                <th>{skill.get('displayName')}</th>
                <th className="GenericTable__statistic text-center">
                  {skill.get('purchaseCount')}
                </th>
                <td className="cursor-pointer"
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
                <td className="cursor-pointer"
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
    );
  }
);
