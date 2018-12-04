import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {
  globalActions,
  characterActions,
  routerActions,
  selectors,
} from '../store';
import { connect } from 'react-redux';
import { Widget, Flex } from '../widgets';
import SearchResult from './SearchResult.jsx';

@connect((state, props) => ({
  results: state.get('searchResults'),
  selectedCharacter: selectors.getCharacter(state, state.get('activeCharacterId')),
  state: state,
  characterCharacteristics: selectors.getCharacterCharacteristics(state, state.get('activeCharacterId'))
}),
  dispatch => ({
    actions: bindActionCreators(globalActions, dispatch),
    router: bindActionCreators(routerActions, dispatch),
    characterActions: bindActionCreators(characterActions, dispatch),
  }),
  null,
  { withRef: true })
export default class Search extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      results,
      actions,
      selectedCharacter,
      characterActions,
      characterCharacteristics,
      state
    } = this.props;
    return (<div className="ui category search fluid" ref={node => this.searchNode = node}>
      <div className="ui icon input fluid">
        <input className="prompt" type="text" placeholder="Search..."
          onFocus={(e) => actions.searchQuery(e.target.value)}
          onChange={(e) => actions.searchQuery(e.target.value)}
        />
        <i className="search icon"></i>
      </div>
      <div
        className={"results" + (results && results.length && " transition visible" || "")}
        style={{
          overflowY: 'auto',
          maxHeight: '80vh'
        }}
        onBlur={(e) => { actions.searchQuery('') }}
      >
        {results && results.map((result, index) => {
          return (<div key={result.key} className="result">
            <SearchResult {...result}
              character={selectedCharacter}
              actions={characterActions}
              characterCharacteristics={characterCharacteristics}
              state={state} />
          </div>);
        })}
      </div>
    </div>);
  }

}