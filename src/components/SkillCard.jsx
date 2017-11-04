import React from 'react';

export default class SkillCard extends React.Component {

  render() {
    return (
      <div className='skill-card'>
        <div className='skill-card-name'>{this.props.skill.name}</div>
        <pre>{this.props.skill.description}</pre>
      </div>
    );
  }

}
