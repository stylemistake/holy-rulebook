import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions.js';
import * as selectors from '../selectors.js';
import { classes } from '../utils.js';

// Views
import CharacteristicsView from './views/CharacteristicsView.jsx';
import XpView from './views/XpView.jsx';

function DetailsPane(props) {
  const { dispatch, state } = props;
  const { component, title } = router(state);
  if (!component) {
    return null;
  }
  return (
    <div className={classes('DetailsPane', props.className)}>
      <div className="DetailsPane__header ui inverted menu">
        <div className="item clickable"
          onClick={() => dispatch(actions.closeDetailsPane())}>
          <i className="icon left arrow" />
        </div>
        <div className="active item">
          {title || 'Details'}
        </div>
      </div>
      <div className="DetailsPane__content">
        {component}
      </div>
    </div>
  );
}

export default connect((state) => {
  return {
    state: state.get('detailsPane'),
  };
})(DetailsPane);

function router(state) {
  if (!state) {
    return {};
  }
  const route = state.get('route');
  const params = state.get('params');
  const props = { params };

  if (route === 'characteristics') {
    return {
      title: 'Characteristics',
      component: <CharacteristicsView {...props} />,
    };
  }

  if (route === 'xp') {
    return {
      title: 'XP granted/spent',
      component: <XpView {...props} />,
    };
  }

  return {};
}
