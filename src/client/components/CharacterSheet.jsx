'use strict';

import React from 'react';
import Markdown from 'react-remarkable';

import { classes } from '../lib/utils.js';

class Widget extends React.Component {

  render() {
    const { props } = this;
    const rootClass = classes('widget', [
      props.color && ('widget-color-' + props.color),
      props.flex && 'flex-item',
    ]);
    const titleClass = classes('widget-title', [
      props.macro && 'widget-title-big',
    ]);
    const contentClass = classes('widget-content', [
      props.contentClass,
    ]);
    return <div className={rootClass}>
      <div className={titleClass}>
        {props.title}
      </div>
      <div className={contentClass}>
        {props.children}
      </div>
    </div>;
  }

}

class ValueWidget extends React.Component {

  constructor() {
    super();
    this.state = {
      editing: false,
    };
    this.inputRef = React.createRef();
  }

  render() {
    const { props, state } = this;
    const viewElement = (
      <div className="widget-content-value"
        onClick={(e) => {
          // if (!props.editable) {
          //   return;
          // }
          this.setState({
            editing: true,
            value: props.value,
          });
          setTimeout(() => this.inputRef.current.focus(), 10);
        }}>
        {props.value}
      </div>
    );
    const editElement = (
      <input type="number"
        className="widget-content-value"
        ref={this.inputRef}
        style={{ width: '100%', height: '100%' }}
        value={state.value}
        onChange={(e) => {
          this.setState({ value: e.target.value });
        }}
        onBlur={(e) => {
          this.setState({ editing: false });
          props.onChange && props.onChange(state.value);
        }} />
    );
    return <Widget {...props}>
      {state.editing ? editElement : viewElement}
    </Widget>;
  }

}

class ListWidget extends React.Component {

  render() {
    const { props } = this;
    return <Widget contentClass="widget-content-table" {...props}>
      <table>
        <tbody>
          {props.children}
        </tbody>
      </table>
    </Widget>;
  }

}

class ListWidgetItem extends React.Component {

  render() {
    const { props } = this;
    return <tr>
      <td>{props.name}</td>
      <td className="text-right">{props.value}</td>
    </tr>;
  }

}

class TextWidget extends React.Component {

  render() {
    const { props } = this;
    return <Widget contentClass="widget-content-text" {...props} />;
  }

}

class Flex extends React.Component {

  render() {
    const { props } = this;
    const rootClass = classes('flex', [
      props.spread && 'flex-spread',
    ]);
    return <div className={rootClass}>
      {this.props.children}
    </div>;
  }

}

export default class CharacterSheet extends React.Component {

  render() {
    const { character } = this.props;
    const cstate = character.state;
    const SKILL_TIERS = ['-20', '', '+10', '+20', '+30', '+40'];
    return <Widget title={character.name} macro={true}>
      <Flex spread={true}>
        <ValueWidget title="Damage" color="red"
          value={cstate.damage}
          onChange={(value) => {
            cstate.damage = value;
            this.forceUpdate();
          }} />
        <ValueWidget title="Fatigue" color="orange"
          value={cstate.fatigue}
          onChange={(value) => {
            cstate.fatigue = value;
            this.forceUpdate();
          }} />
        <ValueWidget title="Corruption" color="yellow"
          value={cstate.corruption}
          onChange={(value) => {
            cstate.corruption = value;
            this.forceUpdate();
          }} />
        <ValueWidget title="Stress" color="green"
          value={cstate.stress}
          onChange={(value) => {
            cstate.stress = value;
            this.forceUpdate();
          }} />
        <ValueWidget title="Fate" color="teal"
          value={cstate.fate}
          onChange={(value) => {
            cstate.fate = value;
            this.forceUpdate();
          }} />
        <ValueWidget title="XP" color="blue"
          value={cstate.experience}
          onChange={(value) => {
            cstate.experience = value;
            this.forceUpdate();
          }} />
      </Flex>
      <Flex>
        <ListWidget title="Skills">
          {character.getSkills().map((x) => {
            return <ListWidgetItem
              key={x.name}
              name={x.name}
              value={SKILL_TIERS[x.tier]} />;
          })}
        </ListWidget>
        <TextWidget title="Notes" color="purple" flex={true}>
          Hello world!
        </TextWidget>
      </Flex>
    </Widget>;
  }

}
