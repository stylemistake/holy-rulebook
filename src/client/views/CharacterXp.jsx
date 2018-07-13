import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, routerActions, selectors } from '../store';
import { Form } from 'semantic-ui-react';

@connect((state, props) => ({
  character: selectors.getCharacter(state, props.characterId),
  gameStateId: selectors.getCharacterGameStateId(state, props.characterId),
  grantedXpEntries: selectors.getCharacterGrantedXpLogEntries(state, props.characterId),
  spentXpEntries: selectors.getCharacterSpentXpLogEntries(state, props.characterId),
}), dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  router: bindActionCreators(routerActions, dispatch),
}))
export default class CharacterXp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      desc: '',
    };
  }

  render() {
    const {
      characterId, character, gameStateId, grantedXpEntries, spentXpEntries,
      actions, router,
    } = this.props;
    if (!character) {
      return null;
    }
    const XP_GRANT_FORM = (
      <Form
        onSubmit={() => {
          const amount = parseInt(this.state.amount, 10);
          const desc = this.state.desc || undefined;
          if (!amount) {
            return;
          }
          actions.grantXp(characterId, amount, desc);
          this.setState({
            amount: '',
            desc: '',
          });
        }}>
        <Form.Group widths="equal">
          <Form.Input
            label="Amount"
            placeholder="Example: 300"
            value={this.state.amount}
            onChange={(e, data) => {
              this.setState({ amount: data.value });
            }} />
          <Form.Input
            label="Description"
            placeholder="Example: Session #1 / Starting XP"
            value={this.state.desc}
            onChange={(e, data) => {
              this.setState({ desc: data.value });
            }} />
        </Form.Group>
        <Form.Button fluid primary
          type="submit"
          content="Grant XP" />
      </Form>
    );

    const XP_GRANT_TABLE = (
      <table className="GenericTable">
        <thead>
          <tr>
            <th>XP granted</th>
            <th>Amount</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {grantedXpEntries.map(entry => (
            <tr key={entry.hashCode()}>
              <th>{entry.get('type')}</th>
              <td>{entry.get('amount')}</td>
              <td>{entry.getIn(['payload', 'desc'])}</td>
              <td className="cursor-pointer"
                onClick={() => actions.removeXpLogEntry(characterId, entry)}>
                <i className="icon delete fitted" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    const XP_SPENT_TABLE = (
      <table className="GenericTable">
        <thead>
          <tr>
            <th>XP spent</th>
            <th></th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {spentXpEntries.map(entry => {
            const payloadType = entry.getIn(['payload', 'type']);
            const payloadId = entry.getIn(['payload', 'id'])
              || entry.getIn(['payload', 'name']);
            return (
              <tr key={entry.hashCode()}>
                <th>{payloadType}</th>
                <th>{payloadId}</th>
                <td>{entry.get('amount')}</td>
                <td className="cursor-pointer"
                  onClick={() => actions.removeXpLogEntry(characterId, entry)}>
                  <i className="icon delete fitted" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );

    return (
      <div className="XpView Layout__content-padding">
        {XP_GRANT_FORM}
        <div className="ui divider" />
        {XP_GRANT_TABLE}
        <div className="ui divider" />
        {XP_SPENT_TABLE}
      </div>
    );
  }

}
