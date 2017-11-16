'use strict';

import React from 'react';
import Markdown from 'react-remarkable';
// import SkillTableRow from './SkillTableRow.jsx';

export default class SkillTable extends React.Component {
  render(){
    const skills = this.props.skills;
    return (
      <table className="skill-table">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Tier</th>
              <th>Cost</th>
              <th>Base</th>
              <th>Aptitudes</th>
              <th>Characteristics</th>
            </tr>
          </thead>
          <tbody>
            {/*Object.keys(skills).map((item, i) => (
                <SkillTableRow key={i} skill={skills[item]} />
            ))*/}
            { skills.map((skill, i) => (
                <tr key={i}>
                 <td className="skill-column">{ (skill.name).toUpperCase() }</td>
                 <td>none</td>
                 <td>none</td>
                 <td>none</td>
                 <td>{ skill.aptitudes }</td>
                 <td>{ skill.characteristics }</td>
               </tr>
            ))}
          </tbody>
      </table>
    );
  }

}
