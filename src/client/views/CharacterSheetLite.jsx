import React from 'react';
import { bindActionCreators } from 'redux';
import {
  flatConnect,
  routerActions,
  characterSelectors,
  actions
} from '../store';
import { Widget, Flex } from '../widgets';
import {
  StateWidget,
  FancyStateWidget,
  CharcsWidget,
  AptitudesWidget,
  SkillsWidget,
  TalentsWidget,
} from './CharacterSheetWidgets.jsx';
import { Grid, Segment } from 'semantic-ui-react';


export default flatConnect(
  (state, props) => ({
    character: characterSelectors.getCharacter(state, props.characterId),
  }),
  dispatch => ({
    router: bindActionCreators(routerActions, dispatch),
    actions: bindActionCreators(actions, dispatch),
  }),
  function CharacterSheet(props) {
    const { characterId, character, router, actions } = props;
    if (!character) {
      return null;
    }
    return (
      <div style={{ maxWidth: '16rem' }}>
        <div className="ui button basic compact fitted icon red"
          onClick={() => actions.removeCharacter(characterId)}>
          <i className="icon remove" />
        </div>
        <Widget title={character.get('name')}
          onClick={() => {
            router.navigateTo('character', { characterId });
          }}>
          <Flex spreadChildren>
            <StateWidget
              characterId={characterId} />
            <CharcsWidget
              characterId={characterId}
              onClick={() => {
                router.navigateTo('character.charcs', { characterId });
              }} />
          </Flex>
          <SkillsWidget title="Skills" color="red" compact
            characterId={characterId}
            onClick={() => {
              router.navigateTo('character.skills', { characterId });
            }} />
          <TalentsWidget title="Talents"
            characterId={characterId}
            onClick={() => {
              router.navigateTo('character.talents', { characterId });
            }} />
        </Widget>
      </div>
    );
  }
);
