import React, { Component } from 'react';
import {
  globalActions,
  routerActions,
  characterSelectors
} from '../store';
import { Widget, Flex } from '../widgets';

export default class WeaponSearchResult extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { character, actions, item, state } = this.props;
    return (<div className="ui grid">
      <div className="row">
        <div className="twelve wide column">
          <div>{item.get('name')}</div>
        </div>
      </div>
      {character && <div className="twelve wide column">
        {character.get('name')}: <div className="ui button basic compact fitted icon green"
          onClick={() => actions.addItem(character.get('id'), item)}>
          Add
        </div>
      </div>}
    </div>);
  }

}