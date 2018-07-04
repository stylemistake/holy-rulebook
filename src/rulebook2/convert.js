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
      const cursor = new Cursor($, cell).walkLeft();
      // Create basic skill object
      const skillObj = {
        name: titleCase(cursor.text()).replace('†', '').trim(),
        characteristic: titleCase(cursor.moveDown(2).text()),
        aptitudes: cursor.moveDown(4).rows(2).map(x => titleCase(x.text())),
        // description: cursor.walkRight().walkDown().text().trim(),
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
          skillObj.specs.push(specNameClean);
          // Walk towards the next description
          curSpecDesc = curSpecDesc.walkDown();
        }
      }
      // Push object
      skills.push(skillObj);
    });

  return skills;
}

//printJSON(getSkills());

//TODO refactor converter into class and use this as method
function processAttribure(definition, object, baseRow, sheet){
    let row = baseRow;
    if(definition.offset){
        //TODO handle horizontal offset: traverse siblings
        let counter = 0;
        while(counter !== definition.offset.magnitude){
            if(definition.offset.magnitude > 0){
                row = row.next();
                counter++;
            }else {
                row = row.prev();
                counter--; 
            }
        }
    }
    if(['text', 'html'].includes(definition.type)){
        object[definition.name] = row.children(definition.marker).first().text();
    } else if(['set'].includes(definition.type)) {
        //TODO handle horizontal set direction
        if(definition.count || definition.stopMarker){
            let finished = false;
            let counter = 0;
            const limiter = 100;
            object[definition.name] = [];
            while(!finished){
                if(
                  (definition.count && definition.count === counter) ||
                  (definition.stopMarker && row.children(definition.stopMarker).length > 0) ||
                  (counter === limiter)
                ){
                    finished = true;
                }
                                object[definition.name].push(row.children(definition.marker).first().text());

                                row = row.next();

                                counter++;

            }
        } else {
            console.error(`Attribute ${definition.type} is set but has no count nor stop marker.`);
        }
    } else {
        console.error(`Unknown attribute type: ${definition.type}.`);
    }
}

let converters = {
    skill: (definition) => {
        const data = fs.readFileSync(definition.sourceFile, 'utf8');
        const sheet = cheerio.load(data);
        const skills = [];
        sheet(definition.containerMarker).find(definition.marker).each((index,element) =>{
            const baseRow = sheet(element).parent();
            let skill = {};
            for (var i = 0; i < definition.attributes.length; i++) {
                processAttribure(definition.attributes[i], skill, baseRow, sheet);
            }
            skills.push(skill);
        });
        return skills;
    }
};

let definitions = [{
        type: "skill",
        marker: "td.s27",
        sourceFile: `${__dirname}/HE2E/SKLS.html`,
        containerMarker: "table tbody",
        attributes: [
            {
                name: "name",
                type: "text",
                marker: "td.s27",
            },
            {
                name: "description",
                type: "html",
                marker: "td.s30:nth-child(1)",
                offset: {
                    direction: "vertical",
                    magnitude: 1
                },
            },
            {
                name: "examples",
                type: "html",
                marker: "td.s30:nth-child(2)",
                offset: {
                    direction: "vertical",
                    magnitude: 1
                },
            },
            {
                name: "characteristic",
                type: "text",
                marker: "td.s32",
                offset: {
                    direction: "vertical",
                    magnitude: 2
                },
            },
            {
                name: "aptitudes",
                type: "set",
                count: 2,
                direction: "vertical",
                marker: "td.s34",
                offset: {
                    direction: "vertical",
                    magnitude: 4,
                },
            },
            {
                name: "time",
                type: "text",
                marker: "td.s35",
                offset: {
                    direction: "vertical",
                    magnitude: 4,
                },
            },
            {
                name: "specialisations",
                type: "set",
                attributes: [
                    {
                        name: "specialisation",
                        type: "text",
                        marker: "td.s11",
                    },
                    {
                        name: "desciption",
                        type: "text",
                        marker: "td.s30",
                    },
                ],
                direction: "vertical",
                marker: "td.s11",
                contentMatcher: /†$/,
                stopMarker: "td.s27",
            },
            {
                name: "subskills",
                type: "set",
                attributes: [
                    {
                        name: "subskill",
                        type: "text",
                        marker: "td.s11",
                    },
                    {
                        name: "desciption",
                        type: "text",
                        marker: "td.s30",
                    },
                ],
                direction: "vertical",
                marker: "td.s11",
                stopMarker: "td.s27",
            }

        ]
    }];

for (var i = 0; i < definitions.length; i++) {
    printJSON(converters[definitions[i].type](definitions[i]));
}