import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions.js';
import * as selectors from '../selectors.js';
import { classes } from '../utils.js';

function DetailsPane(props) {
  const { dispatch, state } = props;
  const route = router(state);
  if (!route) {
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
          {route.title}
        </div>
      </div>
      <div className="DetailsPane__content">
        {route.content}
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
    return;
  }
  const route = state.get('route');

  if (route === 'characteristic') {
    // TODO: Move this to a separate self-contained component
    return {
      title: 'Characteristic',
      content: (
        <Fragment>
          <div>
            {state.getIn(['data', 'name'])}:
            {state.getIn(['data', 'value'])}
          </div>
          <div>
            <div className="ui button">
              Upgrade (-200XP)
            </div>
          </div>
        </Fragment>
      ),
    };
  }

  if (route === 'xp') {
    return {
      title: 'XP granted/spent',
      content: (
        <div>TODO: XP granted/spent table</div>
      ),
    };
  }

}
