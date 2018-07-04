const fs = require('fs');
const cheerio = require('cheerio');
const Cursor = require('./Cursor.js');

function printJSON(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function titleCase(str) {
  const WORD_BREAKS = [' ', '-'];
  let output = '';
  let prevChar = null;
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    output += i === 0 || WORD_BREAKS.includes(prevChar)
      ? char.toUpperCase()
      : char.toLowerCase();
    prevChar = char;
  }
  return output;
}

function getSkills() {
  const data = fs.readFileSync(`${__dirname}/HE2E/SKLS.html`, 'utf8');
  const $ = cheerio.load(data);
  const skills = [];

  $('table tbody').find('td:contains("DESCRIPTION")')
    .each((i, cell) => {
      // Get cursors
      const cursor = new Cursor($, cell).move(-8, 0);
      // Create basic skill object
      const skillObj = {
        name: titleCase(cursor.text()).replace('†', '').trim(),
        characteristic: titleCase(cursor.move(0, 2).text()),
        aptitudes: cursor.move(0, 4).rows(2)
          .map(x => titleCase(x.text())),
        // description: cursor.walk(1, 0).walk(0, 1).text().trim(),
      };
      // Try to collect specialization skills
      const hasSpecs = cursor.text().includes('†');
      if (hasSpecs) {
        skillObj.specs = [];
        // Skip "operate" skill specs because it's problematic to parse
        if (skillObj.name.includes('Operate')) {
          skills.push(skillObj);
          return;
        }
        // Get a cursor positioned on first spec description
        let curSpecDesc = cursor.walk(1, 0).walk(0, 2);
        let specClass = curSpecDesc.move(-8, 0).cell().attr('class');
        while (true) {
          const specCell = curSpecDesc.move(-8, 0).cell();
          const specName = specCell.text();
          // Break when cell doesn't include the spec symbol
          if (!specName.includes('†')) {
            break;
          }
          // Break when cell has different class
          if (specCell.attr('class') !== specClass) {
            break;
          }
          const specNameClean = titleCase(specName).replace('†', '').trim();
          skillObj.specs.push(specNameClean);
          // Walk towards the next description
          curSpecDesc = curSpecDesc.walk(0, 1);
        }
      }
      // Push object
      skills.push(skillObj);
    });

  return skills;
}

printJSON(getSkills());
