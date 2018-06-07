'use strict';

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from './actions.js';
import * as queries from './queries.js';

import {
  CharacterSheet,
  Icon,
  Section,
  Sidebar,
  SidebarItem,
  SkillCard,
  SkillTable,
} from './components';

const STATE_TO_PROPS = (state) => ({
  gameStates: queries.getGameStates(state),
  activeGameState: queries.getActiveGameState(state),
  characters: queries.getCharacters(state),
  activeCharacter: queries.getActiveCharacter(state),
});

const DISPATCH_TO_PROPS = (dispatch) => ({
  onPurgeState(text) {
    dispatch(actions.purgeState(text));
  },
  onSearch(text) {
    dispatch(actions.searchQuery(text));
  },
  onCreateGameState() {
    dispatch(actions.createGameState());
  },
  onSelectGameState(id) {
    dispatch(actions.selectGameState(id));
  },
  onCreateCharacter() {
    dispatch(actions.createCharacter());
  },
  onSelectCharacter(id) {
    dispatch(actions.selectCharacter(id));
  },
  onRemoveCharacter(id) {
    dispatch(actions.removeCharacter(id));
  },
});

@connect(STATE_TO_PROPS, DISPATCH_TO_PROPS)
export default class Layout extends PureComponent {

  render() {
    const { props } = this;
    console.log(props);
    return (
      <div className="react-container">
        <div className="header">
          <div className="header-item header-title">
            Holy Rulebook
          </div>
          <div className="header-item header-search">
            <input
              placeholder="Search..."
              onChange={(e) => props.onSearch(e.target.value)} />
          </div>
        </div>

        <Sidebar>
          <SidebarItem group={true} title="Gamestates">
            <Icon icon="add" onClick={() => props.onCreateGameState()} />
          </SidebarItem>
          {props.gameStates.map((gameState) => {
            const id = gameState.get('id');
            return <SidebarItem key={id}
              title={gameState.get('name')}
              active={gameState === props.activeGameState}
              onClick={() => props.onSelectGameState(id)}>
            </SidebarItem>
          })}
          {props.activeGameState && (
            <SidebarItem group={true} title="Characters">
              <Icon icon="add" onClick={() => props.onCreateCharacter()} />
            </SidebarItem>
          )}
          {props.characters.map((character) => {
            const id = character.get('id');
            return <SidebarItem key={id}
              title={character.get('name')}
              active={props.activeCharacter === character}
              onClick={() => props.onSelectCharacter(id)}>
              <Icon icon="remove" onClick={(e) => {
                props.onRemoveCharacter(id);
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
              onClick={() => props.onPurgeState()} />
          </SidebarItem>
        </Sidebar>

        <div className="content">
          {props.activeCharacter && (
            <CharacterSheet character={props.activeCharacter} />
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
      </div>
    );
  }

}
