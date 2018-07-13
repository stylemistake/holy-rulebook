import React from 'react';
import { bindActionCreators } from 'redux';
import { flatConnect, routerActions } from '../store';

export default flatConnect(
  state => ({}),
  dispatch => ({
    router: bindActionCreators(routerActions, dispatch),
  }),
  function NotFound(props) {
    const { router } = props;
    return (
      <div className="Layout__content-padding">
        Not Found
      </div>
    );
  }
);
