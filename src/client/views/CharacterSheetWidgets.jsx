import React from 'react';
import { bindActionCreators } from 'redux';
import {
  flatConnect,
  characterActions,
  routerActions,
  characterSelectors,
} from '../store';
import { Widget, Flex } from '../widgets';
import { shorten } from '../text.js';

export const StateWidget = flatConnect(
  (state, props) => ({
    character: characterSelectors.getCharacter(state, props.characterId),
    availableXp: characterSelectors.getCharacterAvailableXp(state, props.characterId),
  }),
  function StateWidget(props) {
    const { character, availableXp, ...rest } = props;
    return (
      <Widget {...rest}>
        <Widget.Table>
          <Widget.Table.SimpleItem name="Wounds"
            value={character.getIn(['state', 'wounds'])} />
          <Widget.Table.SimpleItem name="Fatigue"
            value={character.getIn(['state', 'fatigue'])} />
          <Widget.Table.SimpleItem name="Corruption"
            value={character.getIn(['state', 'corruption'])} />
          <Widget.Table.SimpleItem name="Stress"
            value={character.getIn(['state', 'stress'])} />
          <Widget.Table.SimpleItem name="Fate points"
            value={character.getIn(['state', 'fate'])} />
          <Widget.Table.SimpleItem name="Influence"
            value={character.getIn(['state', 'influence'])} />
          <Widget.Table.SimpleItem name="Experience"
            value={availableXp} />
        </Widget.Table>
      </Widget>
    );
  }
);

export const FancyStateWidget = flatConnect(
  (state, props) => ({
    character: characterSelectors.getCharacter(state, props.characterId),
    availableXp: characterSelectors.getCharacterAvailableXp(state, props.characterId),
  }),
  dispatch => ({
    actions: bindActionCreators(characterActions, dispatch),
    router: bindActionCreators(routerActions, dispatch),
  }),
  function FancyStateWidget(props) {
    const { characterId, character, availableXp, actions, router, ...rest } = props;
    return (
      <Flex spreadChildren>
        <Widget title="Wounds" color="red">
          <Widget.Value
            value={character.getIn(['state', 'wounds'])}
            onChange={value => {
              actions.updateCharacterValue(characterId, ['state', 'wounds'], value);
            }} />
        </Widget>
        <Widget title="Fatigue" color="orange">
          <Widget.Value
            value={character.getIn(['state', 'fatigue'])}
            onChange={value => {
              actions.updateCharacterValue(characterId, ['state', 'fatigue'], value);
            }} />
        </Widget>
        <Widget title="Corruption" color="yellow">
          <Widget.Value
            value={character.getIn(['state', 'corruption'])}
            onChange={value => {
              actions.updateCharacterValue(characterId, ['state', 'corruption'], value);
            }} />
        </Widget>
        <Widget title="Stress" color="green">
          <Widget.Value
            value={character.getIn(['state', 'stress'])}
            onChange={value => {
              actions.updateCharacterValue(characterId, ['state', 'stress'], value);
            }} />
        </Widget>
        <Widget title="Fate" color="teal">
          <Widget.Value
            value={character.getIn(['state', 'fate'])}
            onChange={value => {
              actions.updateCharacterValue(characterId, ['state', 'fate'], value);
            }} />
        </Widget>
        <Widget title="XP" color="blue"
          onClick={() => {
            router.navigateTo('character.xp', { characterId });
          }}>
          <Widget.Value editable={false} value={availableXp} />
        </Widget>
        <Widget title="Influence">
          <Widget.Value
            value={character.getIn(['state', 'influence'])}
            onChange={value => {
              actions.updateCharacterValue(characterId, ['state', 'influence'], value);
            }} />
        </Widget>
      </Flex>
    );
  }
);

export const CharcsWidget = flatConnect(
  (state, props) => ({
    charcs: characterSelectors.getCharacterCharacteristics(state, props.characterId),
  }),
  function CharcsWidget(props) {
    const { charcs, ...rest } = props;
    return (
      <Widget {...rest}>
        <Widget.Table>
          {charcs.map(charc => (
            <Widget.Table.SimpleItem key={charc.hashCode()}
              name={shorten(charc.get('name'))}
              title={charc.get('name')}
              value={charc.get('value')} />
          ))}
        </Widget.Table>
      </Widget>
    );
  }
);

export const AptitudesWidget = flatConnect(
  (state, props) => ({
    aptitudes: characterSelectors.getCharacterAptitudes(state, props.characterId),
  }),
  function AptitudesWidget(props) {
    const { aptitudes, ...rest } = props;
    return (
      <Widget {...rest}>
        <Widget.Table>
          {aptitudes.map(x => (
            <Widget.Table.SimpleItem key={x} name={x} />
          ))}
        </Widget.Table>
      </Widget>
    );
  }
);

export const SkillsWidget = flatConnect(
  (state, props) => ({
    skills: characterSelectors.getCharacterSkills(state, props.characterId)
      .filter(skill => skill.get('purchaseCount') > 0),
  }),
  function SkillsWidget(props) {
    const { skills, compact, ...rest } = props;
    return (
      <Widget {...rest}>
        <Widget.Table>
          {skills.map(skill => (
            <Widget.Table.Row key={skill.hashCode()}>
              <Widget.Table.Cell
                content={skill.get('displayName') || skill.get('name')} />
              {compact || (
                <Widget.Table.Cell
                  content={'+' + skill.get('bonus')} />
              )}
              <Widget.Table.Cell className="text-right"
                content={skill.get('characteristic').substr(0, 3)} />
              <Widget.Table.Cell className="text-left"
                content={'' + skill.get('threshold')} />
            </Widget.Table.Row>
          ))}
        </Widget.Table>
      </Widget>
    );
  }
);

export const TalentsWidget = flatConnect(
  (state, props) => ({
    talents: characterSelectors.getCharacterTalents(state, props.characterId)
      .filter(talent => talent.get('purchaseCount') > 0),
  }),
  function TalentsWidget(props) {
    const { talents, ...rest } = props;
    return (
      <Widget {...rest}>
        <Widget.Table>
          {talents.map(talent => (
            <Widget.Table.Row key={talent.hashCode()}>
              <Widget.Table.Cell
                title={talent.get('description')}
                content={talent.get('displayName')} />
            </Widget.Table.Row>
          ))}
        </Widget.Table>
      </Widget>
    );
  }
);


export const ItemsWidget = flatConnect(
  (state, props) => ({
    items: characterSelectors.getCharacterItems(state, props.characterId)
  }),
  function ItemsWidget(props) {
    const { items, ...rest } = props;
    return (
      <Widget {...rest}>
        <Widget.Table>
          {items.map(item => (
            <Widget.Table.Row >
              <Widget.Table.Cell
                title={item.get('name')}
                content={item.get('name')} />
            </Widget.Table.Row>
          ))}
        </Widget.Table>
      </Widget>
    );
  }
);
