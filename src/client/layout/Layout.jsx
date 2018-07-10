import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, selectors } from '../store';
import { CharacterSheet } from '../views';

import DetailsPane from './DetailsPane.jsx';
import Sidebar from './Sidebar.jsx';
import SidebarItem from './SidebarItem.jsx';
import SidebarItemIcon from './SidebarItemIcon.jsx';

@connect(state => ({
  gameStates: selectors.getGameStates(state),
  activeGameState: selectors.getActiveGameState(state),
  characters: selectors.getActiveGameStateCharacters(state),
  activeCharacter: selectors.getActiveCharacter(state),
}), dispatch => ({
  actions: bindActionCreators(actions, dispatch),
}))
export default class Layout extends Component {
  render() {
    const {
      actions,
      gameStates, activeGameState,
      characters, activeCharacter,
    } = this.props;
    return (
      <div className="Layout react-container">
        <div className="Layout__header header">
          <div className="header-item header-title">
            Holy Rulebook
          </div>
          <div className="header-item header-search">
            <input
              placeholder="Search..."
              onChange={(e) => actions.searchQuery(e.target.value)} />
          </div>
        </div>

        <div className="Layout__sidebar sidebar">
          <SidebarItem group={true} title="Gamestates">
            <SidebarItemIcon icon="add"
              onClick={() => actions.createGameState()} />
          </SidebarItem>
          {gameStates.map((gameState) => {
            const id = gameState.get('id');
            return <SidebarItem key={id}
              title={gameState.get('name')}
              active={gameState === activeGameState}
              onClick={() => actions.selectGameState(id)}>
            </SidebarItem>
          })}
          {activeGameState && (
            <SidebarItem group={true} title="Characters">
              <SidebarItemIcon icon="add"
                onClick={() => actions.createCharacter()} />
            </SidebarItem>
          )}
          {characters.map((character) => {
            const id = character.get('id');
            return <SidebarItem key={id}
              title={character.get('name')}
              active={activeCharacter === character}
              onClick={() => actions.selectCharacter(id)}>
              <SidebarItemIcon icon="remove"
                onClick={(e) => {
                  actions.removeCharacter(id);
                  e.stopPropagation();
                }} />
            </SidebarItem>
          })}
          <SidebarItem group={true} title="Settings">
            <SidebarItem title="Purge state"
              onClick={() => actions.purgeState()} />
          </SidebarItem>
        </div>

        <div className="Layout__content">
          {activeCharacter && (
            <CharacterSheet characterId={activeCharacter.get('id')} />
          )}
        </div>

        <DetailsPane className="Layout__details" />
      </div>
    );
  }
}
