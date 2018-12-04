// TODO: Implement search
export function searchQuery(text) {

  return {
    type: 'SEARCH_QUERY',
    payload: { text },
  };
}

export function openDetailsPane(route, params = {}) {
  return {
    type: 'OPEN_DETAILS_PANE',
    payload: { route, params },
  };
}

export function closeDetailsPane() {
  return {
    type: 'CLOSE_DETAILS_PANE',
  };
}

export function selectCharacter(characterId) {
  return {
    type: 'SELECT_CHARACTER',
    payload: { characterId },
  };
}
