import React from 'react';
import { bindActionCreators } from 'redux';
import {
  flatConnect,
  characterActions,
  routerActions,
  characterSelectors,
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

export default flatConnect(
  (state, props) => ({
    character: characterSelectors.getCharacter(state, props.characterId),
    gameStateId: characterSelectors.getCharacterGameStateId(state, props.characterId),
  }),
  dispatch => ({
    actions: bindActionCreators(characterActions, dispatch),
    router: bindActionCreators(routerActions, dispatch),
  }),
  function CharacterSheet(props) {
    const {
      characterId, character, gameStateId,
      actions, router,
    } = props;
    if (!character) {
      return null;
    }
    return (
      <div style={{ maxWidth: '64rem', minWidth: '48rem' }}>
        <Widget title="Character name">
          <Widget.Value
            value={character.get('name')}
            onChange={value => {
              actions.updateCharacterValue(characterId, ['name'], value);
            }} />
        </Widget>
        <FancyStateWidget characterId={characterId} />
        <Flex>
          <CharcsWidget title="Characteristics"
            characterId={characterId}
            onClick={() => {
              router.navigateTo('character.charcs', { characterId });
            }} />
          <AptitudesWidget title="Aptitudes"
            characterId={characterId}
            onClick={() => {
              router.navigateTo('character.aptitudes', { characterId });
            }} />
          <Widget title="Notes" color="purple" fluid>
            <Widget.Text content="Hello world!" />
          </Widget>
        </Flex>
        <Flex>
          <SkillsWidget title="Skills" color="red" fluid
            characterId={characterId}
            onClick={() => {
              router.navigateTo('character.skills', { characterId });
            }} />
          <TalentsWidget title="Talents" fluid
            characterId={characterId}
            onClick={() => {
              router.navigateTo('character.talents', { characterId });
            }} />
        </Flex>
      </div>
    );
  }
);
