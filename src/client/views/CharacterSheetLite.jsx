import React from 'react';
import { bindActionCreators } from 'redux';
import {
  flatConnect,
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
import { Grid, Segment } from 'semantic-ui-react';


export default flatConnect(
  (state, props) => ({
    character: characterSelectors.getCharacter(state, props.characterId),
  }),
  dispatch => ({
    router: bindActionCreators(routerActions, dispatch),
  }),
  function CharacterSheet(props) {
    const { characterId, character, router } = props;
    if (!character) {
      return null;
    }
    return (
      <div style={{ maxWidth: '16rem' }}>
        <Widget title={character.get('name')}
          onClick={() => {
            router.navigateTo('character', { characterId });
          }}>
          <Grid columns='equal'>
            <Grid.Row>
              <Grid.Column>
                <StateWidget
                  characterId={characterId} />
              </Grid.Column>
              <Grid.Column>
                <CharcsWidget title="Characteristics"
                  characterId={characterId}
                  onClick={() => {
                    router.navigateTo('character.charcs', { characterId });
                  }} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
              <Grid.Column>
                <SkillsWidget title="Skills" color="red" compact
                  characterId={characterId}
                  onClick={() => {
                    router.navigateTo('character.skills', { characterId });
                  }} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
              <Grid.Column>
                <TalentsWidget title="Talents"
                  characterId={characterId}
                  onClick={() => {
                    router.navigateTo('character.talents', { characterId });
                  }} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Widget>
      </div>
    );
  }
);
