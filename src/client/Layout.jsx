'use strict';

import React from 'react';
import store from './lib/store.js';
import { bound, throttle } from './lib/decorators.js';

import {
  CharacterSheet,
  SkillCard,
  Section,
  SkillTable,
  Sidebar,
  SidebarItem,
  SidebarItemButton,
} from './components';

// // Query for rulebook data
// const acrobatics = store.query('/skills/acrobatics');
// const sections = store.queryAll('/sections/skills');
// const skills = store.findSkills();
// const toc = store.query('/toc');

export default class Layout extends React.Component {

  constructor() {
    super();
    // Local state
    this.state = {
      searchText: '',
      gameState: null,
      character: null,
    };
    // Game state
    store.subscribe(() => this.forceUpdate());
  }

  @throttle(200)
  onSearch(searchText) {
    this.setState({ searchText });
  }

  render() {
    const { gameState, character } = this.state;
    return (
      <div className="react-container">
        <div className="header">
          <div className="header-item header-title">
            Holy Rulebook
          </div>
          <div className="header-item header-search">
            <input
              placeholder="Search..."
              onChange={(e) => this.onSearch(e.target.value)} />
          </div>
        </div>

        <Sidebar>
          <SidebarItem group={true} title="Gamestates">
            <SidebarItemButton icon="add"
              onClick={() => store.createGameState()} />
          </SidebarItem>
          {store.gameStates.map(gameState => {
            return <SidebarItem
              key={gameState.id}
              title={gameState.name}
              active={this.state.gameState === gameState}
              onClick={() => {
                this.setState({
                  gameState,
                  character: null,
                });
              }}>
            </SidebarItem>
          })}
          {gameState && (
            <SidebarItem group={true} title="Characters">
              <SidebarItemButton icon="add"
                onClick={() => gameState.createCharacter()} />
            </SidebarItem>
          )}
          {gameState && gameState.getCharacters().map(character => {
            return <SidebarItem
              key={character.id}
              title={character.name}
              active={this.state.character === character}
              onClick={() => this.setState({ character })}>
              <SidebarItemButton icon="remove" onClick={() => {
                this.setState({ character: null });
                gameState.removeCharacter(character.id);
              }} />
            </SidebarItem>
          })}
          <SidebarItem group={true} title="Table of contents">
            <SidebarItem title="TODO" />
          </SidebarItem>
        </Sidebar>

        <div className="content">
          {character && <CharacterSheet character={character} />}
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

// TODO: routing (currently not needed)
// import { BrowserRouter, Route } from 'react-router-dom';
// import { Link } from 'react-router';

// const routes = (
//   <BrowserRouter
//     history={window.history}
//     onUpdate={() => window.scrollTo(0, 0)}>
//     <Route path='/' exact component={IndexPage} />
//   </BrowserRouter>
// );
