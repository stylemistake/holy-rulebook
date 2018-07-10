import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, routerActions, selectors } from '../store';

@connect(state => ({}), dispatch => ({
  router: bindActionCreators(routerActions, dispatch),
}))
export default class NotFound extends Component {

  render() {
    const { router } = this.props;
    setTimeout(() => router.navigateTo('index'), 2000);
    return <div>Not Found</div>;
  }

}
