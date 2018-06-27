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

import { TextWidget } from './components/widgets';

const STATE_TO_PROPS = (state) => ({
  gameStates: queries.getGameStates(state),
  activeGameState: queries.getActiveGameState(state),
  characters: queries.getCharacters(state),
  activeCharacter: queries.getActiveCharacter(state),
  // TODO: Move this to queries
  activeCharc: state.get('activeCharc'),
});

const DISPATCH_TO_PROPS = (dispatch) => ({ dispatch });

@connect(STATE_TO_PROPS, DISPATCH_TO_PROPS)
export default class Layout extends PureComponent {

  render() {
    const { props } = this;
    const { dispatch } = this.props;
    return (
      <div className="react-container">
        <div className="header">
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

        <Sidebar>
          <SidebarItem group={true} title="Gamestates">
            <Icon icon="add" onClick={() => {
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
              <Icon icon="add" onClick={() => {
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
              <Icon icon="remove" onClick={(e) => {
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
        </Sidebar>

        <div className="content">
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
      </div>
    );
  }

}
