import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

@connect()
export default class CharacteristicsView extends Component {

  render() {
    const { params } = this.props;
    return (
      <Fragment>
        <div>
          <div className="ui button">
            Upgrade (-200XP)
          </div>
        </div>
      </Fragment>
    );
  }

}
