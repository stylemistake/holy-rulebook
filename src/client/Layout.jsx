'use strict';

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from './actions.js';
import * as selectors from './selectors.js';

import {
  CharacterSheet,
  DetailsPane,
  Section,
  Sidebar,
  SidebarItem,
  SidebarItemIcon,
  SkillCard,
  SkillTable,
} from './components';

import { TextWidget } from './components/widgets';

const STATE_TO_PROPS = (state) => {
  return {
    gameStates: selectors.getGameStates(state),
    activeGameState: selectors.getActiveGameState(state),
    characters: selectors.getCharacters(state),
    activeCharacter: selectors.getActiveCharacter(state),
    // TODO: Move this to selectors
    activeCharc: state.get('activeCharc'),
  };
};

@connect(STATE_TO_PROPS)
export default class Layout extends PureComponent {

  render() {
    const { props } = this;
    const { dispatch } = this.props;
    return (
      <div className="Layout react-container">
        <div className="Layout__header header">
          <div className="header-item header-title">
            Holy Rulebook
          </div>
          <div className="header-item header-search">
            <input
              placeholder="Search..."
              onChange={(e) => {
                dispatch(actions.searchQuery(e.target.value))
              }} />
          </div>
        </div>

        <div className="Layout__sidebar sidebar">
          <SidebarItem group={true} title="Gamestates">
            <SidebarItemIcon icon="add" onClick={() => {
              dispatch(actions.createGameState());
            }} />
          </SidebarItem>
          {props.gameStates.map((gameState) => {
            const id = gameState.get('id');
            return <SidebarItem key={id}
              title={gameState.get('name')}
              active={gameState === props.activeGameState}
              onClick={() => {
                dispatch(actions.selectGameState(id));
              }}>
            </SidebarItem>
          })}
          {props.activeGameState && (
            <SidebarItem group={true} title="Characters">
              <SidebarItemIcon icon="add" onClick={() => {
                dispatch(actions.createCharacter());
              }} />
            </SidebarItem>
          )}
          {props.characters.map((character) => {
            const id = character.get('id');
            return <SidebarItem key={id}
              title={character.get('name')}
              active={props.activeCharacter === character}
              onClick={() => {
                dispatch(actions.selectCharacter(id));
              }}>
              <SidebarItemIcon icon="remove" onClick={(e) => {
                dispatch(actions.removeCharacter(id));
                e.stopPropagation();
              }} />
            </SidebarItem>
          })}
          {/*
          <SidebarItem group={true} title="Table of contents">
            <SidebarItem title="TODO" />
          </SidebarItem>
          */}
          <SidebarItem group={true} title="Settings">
            <SidebarItem title="Purge state"
              onClick={() => dispatch(actions.purgeState())} />
          </SidebarItem>
        </div>

        <div className="Layout__content">
          {props.activeCharacter && (
            <CharacterSheet character={props.activeCharacter} />
          )}
          {props.activeCharc && (
            <TextWidget title={props.activeCharc.get('name')}>
              <div>
                {props.activeCharc.get('name')}:
                {props.activeCharc.get('value')}
              </div>
              <div>
                <button>Upgrade (-200XP)</button>
              </div>
            </TextWidget>
          )}
          {/*
          {sections
            .filter((section) => {
              const title = section.title.toLowerCase();
              const query = this.state.searchText.toLowerCase();
              return title.includes(query);
            })
            .map((section) => <Section key={section.id} item={section} />)}
          <SkillCard item={acrobatics} />
          <SkillTable skills={skills} />
          */}
        </div>

        <DetailsPane className="Layout__details" />
      </div>
    );
  }

}
