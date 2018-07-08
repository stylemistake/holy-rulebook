import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions, selectors } from '../state';
import { CharacterSheet } from '../views';

import DetailsPane from './DetailsPane.jsx';
import Sidebar from './Sidebar.jsx';
import SidebarItem from './SidebarItem.jsx';
import SidebarItemIcon from './SidebarItemIcon.jsx';

import * as relayActions from '../state/relayActions.js';

@connect(state => ({
  gameStates: selectors.getGameStates(state),
  activeGameState: selectors.getActiveGameState(state),
  characters: selectors.getActiveGameStateCharacters(state),
  activeCharacter: selectors.getActiveCharacter(state),
}))
export default class Layout extends Component {

  componentDidMount() {
    this.props.dispatch(relayActions.connectToRelay());
  }

  componentWillUnmount() {
    this.props.dispatch(relayActions.disconnectFromRelay());
  }

  render() {
    const {
      dispatch,
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
          {gameStates.map((gameState) => {
            const id = gameState.get('id');
            return <SidebarItem key={id}
              title={gameState.get('name')}
              active={gameState === activeGameState}
              onClick={() => {
                dispatch(actions.selectGameState(id));
              }}>
            </SidebarItem>
          })}
          {activeGameState && (
            <SidebarItem group={true} title="Characters">
              <SidebarItemIcon icon="add" onClick={() => {
                dispatch(actions.createCharacter());
              }} />
            </SidebarItem>
          )}
          {characters.map((character) => {
            const id = character.get('id');
            return <SidebarItem key={id}
              title={character.get('name')}
              active={activeCharacter === character}
              onClick={() => {
                dispatch(actions.selectCharacter(id));
              }}>
              <SidebarItemIcon icon="remove" onClick={(e) => {
                dispatch(actions.removeCharacter(id));
                e.stopPropagation();
              }} />
            </SidebarItem>
          })}
          <SidebarItem group={true} title="Settings">
            <SidebarItem title="Purge state"
              onClick={() => dispatch(actions.purgeState())} />
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
