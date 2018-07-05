const fs = require('fs');
const cheerio = require('cheerio');
const Cursor = require('./Cursor.js');
const {
  printJSON,
  capitalize,
  titleCase,
  cleanUpString,
} = require('./utils.js');

function getSkills() {
  const data = fs.readFileSync(`${__dirname}/HE2E/SKLS.html`, 'utf8');
  const $ = cheerio.load(data);
  return $('table tbody td:contains("EXAMPLE MODIFIERS")')
    .map((i, $elem) => {
      // Create basic skill object
      const obj = {};

      // Get cursors
      const cursor = new Cursor($, $elem).walkLeft(2);

      // Fill basic fields
      obj.name = cleanUpString(titleCase(cursor.text()));
      obj.characteristic = titleCase(cursor.moveDown(2).text());
      obj.aptitudes = cursor.moveDown(4).rows(2).map(x => titleCase(x.text()));
      // obj.description = cursor.walkRight().walkDown().text().trim();

      // Try to collect specialization skills
      const hasSpecs = cursor.text().includes('†');
      if (hasSpecs) {
        obj.specs = [];
        // Skip "Operate" because it's problematic to parse
        if (obj.name.includes('Operate')) {
          // Return skill object
          return obj;
        }
        // Get a cursor positioned on first spec description
        let curSpecDesc = cursor.walkRight().walkDown(2);
        let specClass = curSpecDesc.walkLeft().cell().attr('class');
        while (true) {
          const specCell = curSpecDesc.walkLeft().cell();
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
          obj.specs.push(specNameClean);
          // Walk towards the next description
          curSpecDesc = curSpecDesc.walkDown();
        }
      }

      // Return skill object
      return obj;
    })
    .toArray();
}

printJSON(getSkills());
