import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Input, Icon } from 'semantic-ui-react';
import * as selectors from '../../selectors.js';

@connect(state => {
  return {
    character: selectors.getActiveCharacter(state),
  };
})
export default class XpView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  render() {
    const { dispatch, params, character } = this.props;
    return (
      <div>
        <strong>XP granted:</strong>
        {character.get('xpLog').map((x, i) => {
          const amount = x.get('amount');
          if (!amount || amount < 0) {
            return null;
          }
          return (
            <div key={i}>
              {amount}
              <Icon className="clickable" name="delete"
                onClick={() => {
                  dispatch({
                    type: 'XP_LOG_REMOVE',
                    payload: { index: i },
                  });
                }} />
            </div>
          );
        })}
        <strong>XP spent:</strong>
        {character.get('xpLog').map((x, i) => {
          const amount = x.get('amount');
          if (amount >= 0) {
            return null;
          }
          return (
            <div key={i}>
              {amount}
              <Icon className="clickable" name="delete"
                onClick={() => {
                  dispatch({
                    type: 'XP_LOG_REMOVE',
                    payload: { index: i },
                  });
                }} />
            </div>
          );
        })}
        <Input value={this.state.value}
          onChange={(e, data) => {
            this.setState({ value: data.value });
          }} />
        <Button content="Grant"
          onClick={() => {
            const amount = parseInt(this.state.value, 10);
            if (!amount) {
              return;
            }
            dispatch({
              type: 'XP_LOG_APPEND',
              payload: { amount },
            });
            this.setState({ value: '' });
          }} />
      </div>
    );
  }

}
