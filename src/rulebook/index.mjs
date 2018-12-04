import { compose, chain, pipeline } from './functional.mjs';
import * as sheets from './sheets.mjs';
import * as tfm from './transform.mjs';

const HE2E_PATH = 'src/rulebook/HE2E';


//  Rulebook definition
// --------------------------------------------------------

export function getRulebook() {
  return {
    skills: getRulebookSkills('SKLS'),
    talents: [
      ...getRulebookTalents('TALE'),
      // TODO: Talents from other sheets (e.g ABL and PSY)
    ],
    items: [
      // Items (general)
      ...getRulebookItemsGeneral('ITM', 'CAPACITY ITEMS', ['Capacity']),
      ...getRulebookItemsGeneral('ITM', 'CLOTHING', ['Clothing']),
      ...getRulebookItemsGeneral('ITM', 'WEARABLES', ['Wearables']),
      ...getRulebookItemsGeneral('ITM', 'SPECIALIZATION KITS AND PACKAGES', ['Kits']),
      ...getRulebookItemsGeneral('ITM', 'STAND-ALONE TOOLS', ['Tools']),
      ...getRulebookItemsGeneral('ITM', 'PSYKER AND WITCH HANDLER ITEMS', ['Psyker']),
      ...getRulebookItemsGeneral('ITM', 'EXPLOSIVES AND TRAPS', ['Explosives']),
      ...getRulebookItemsGeneral('ITM', 'CAMPING AND FORTIFICATION SUPPLY', ['Camping']),
      ...getRulebookItemsGeneral('ITM', 'BOOKS AND DOCUMENTS', ['Books']),
      ...getRulebookItemsGeneral('ITM', 'DRUGS, CONSUMABLES and MEDICINE (non-food)', ['Drugs']),
      ...getRulebookItemsGeneral('ITM', 'FOOD, RATIONS and ALCOHOL', ['Food']),
      ...getRulebookItemsGeneral('ITM', 'BIONICS', ['Bionics']),
      // Weapons (ranged)
      ...getRulebookItemsWeapons('WPNS', 'Las Weapons', 'Las'),
      ...getRulebookItemsWeapons('WPNS', 'Solid Projectile Weapons', 'Solid Projectile'),
      ...getRulebookItemsWeapons('WPNS', 'Bolt Weapons', 'Bolt'),
      ...getRulebookItemsWeapons('WPNS', 'Energy Weapons', 'Energy'),
      ...getRulebookItemsWeapons('WPNS', 'Melta Weapons', 'Melta'),
      ...getRulebookItemsWeapons('WPNS', 'Plasma Weapons', 'Plasma'),
      ...getRulebookItemsWeapons('WPNS', 'Primitive Weapons', 'Primitive'),
      ...getRulebookItemsWeapons('WPNS', 'Launchers', 'Launcher'),
      ...getRulebookItemsWeapons('WPNS', 'Grenades and Missiles', 'Projectile'),
      // Weapons (melee)
      ...getRulebookItemsWeapons('WPNS', 'Primitive Weapons (Single-Handed)', 'Primitive', ['Single-Handed']),
      ...getRulebookItemsWeapons('WPNS', 'Primitive Weapons (Two-Handed)', 'Primitive', ['Two-Handed']),
      ...getRulebookItemsWeapons('WPNS', 'Shields', 'Shield'),
      ...getRulebookItemsWeapons('WPNS', 'Chain Weapons', 'Chain'),
      ...getRulebookItemsWeapons('WPNS', 'Power Weapons', 'Power'),
      ...getRulebookItemsWeapons('WPNS', 'Force Weapons', 'Force'),
      ...getRulebookItemsWeapons('WPNS', 'Shock Weapons', 'Shock'),
      ...getRulebookItemsWeapons('WPNS', 'Exotic Weapons', 'Exotic'),
    ],
  };
}

function getRulebookSkills(sheetName) {
  const sheet = sheets.getSheet(HE2E_PATH, sheetName);
  return sheets.findManyCellsByText(sheet, 'DESCRIPTION')
    // Move to the top-left corner
    .map(sheets.walkCursorLeft(1))
    // Iterate over cells
    .map(cursor => {
      // Create a skill object
      return {
        name: pipeline([
          sheets.cursorToText,
          tfm.cleanUpString,
          tfm.toTitleCase,
        ])(cursor),
        description: pipeline([
          sheets.walkCursorRight(1),
          sheets.walkCursorDown(1),
          sheets.cursorToText,
          tfm.cleanUpString,
        ])(cursor),
        aptitudes: pipeline([
          sheets.walkCursorDown(3),
          sheets.cursorToVerticalList(2),
          sheets.cursorToText,
          tfm.cleanUpString,
          tfm.toTitleCase,
        ])(cursor),
        characteristic: pipeline([
          sheets.walkCursorDown(1),
          sheets.cursorToText,
          tfm.cleanUpString,
          tfm.toTitleCase,
        ])(cursor),
        time: pipeline([
          sheets.walkCursorDown(4),
          sheets.walkCursorRight(1),
          sheets.cursorToText,
          tfm.cleanUpString,
        ])(cursor),
        examples: pipeline([
          sheets.walkCursorRight(2),
          sheets.walkCursorDown(1),
          sheets.cursorToHtml,
          tfm.splitStringBy('<br>'),
        ])(cursor),
        ...getRulebookSubskills(cursor),
      };
    });
}

/**
 * Finds sub-skills in the skill card, and returns them as objects, which
 * are meant to be merged with the main skill object.
 *
 * @param  {Cursor} skillRootCursor  Cursor, which points to the top-left
 * corner of the skill card.
 * @return {Object[]} Array of skill objects.
 */
function getRulebookSubskills(skillRootCursor) {
  const subskills = [];
  const specializations = [];
  // Define a starting point
  let cursor = pipeline([
    sheets.walkCursorRight(1),
    sheets.walkCursorDown(2),
  ])(skillRootCursor);
  // Iterate over subskills
  while (true) {
    // Detect an end of the list
    const isEndOfSubskills = pipeline([
      sheets.cursorToText,
      str => str.length === 0 || str.includes('DESCRIPTION'),
    ])(cursor);
    if (isEndOfSubskills) {
      break;
    }
    // Detect whether it is a specialization
    const isSpecialization = pipeline([
      sheets.walkCursorLeft(1),
      sheets.cursorToText,
      str => str.includes('†'),
    ])(cursor);
    // Create a subskill object
    const subskill = {
      name: pipeline([
        sheets.walkCursorLeft(1),
        sheets.cursorToText,
        tfm.cleanUpString,
        tfm.toTitleCase,
      ])(cursor),
      description: pipeline([
        sheets.cursorToText,
        tfm.cleanUpString,
      ])(cursor)
    };
    // Push subskill
    if (isSpecialization) {
      subskill.examples = pipeline([
        sheets.walkCursorRight(1),
        sheets.cursorToHtml,
        tfm.splitStringBy('<br>'),
        tfm.filterEmpty
      ])(cursor);
      specializations.push(subskill);
    }
    else {
      subskills.push(subskill);
    }
    // Move cursor
    cursor = sheets.walkCursorDown(1)(cursor);
  }
  return {
    subskills,
    specializations,
  };
}

function getRulebookTalents(sheetName) {
  const sheet = sheets.getSheet(HE2E_PATH, sheetName);
  const columnMapping = new Map([
    ['Talent', {
      propName: 'name',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.cleanUpString,
        tfm.toTitleCase,
      ]),
    }],
    ['Prerequisites', {
      propName: 'prerequisites',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.cleanUpString,
      ]),
    }],
    ['Tier', {
      propName: 'tier',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.toInteger,
      ]),
    }],
    ['Aptitude 1', {
      propName: 'aptitudes',
      mappingFn: pipeline([
        sheets.cursorToHorizontalList(2),
        sheets.cursorToText,
        tfm.cleanUpString,
        tfm.toTitleCase,
      ]),
    }],
    ['Description', {
      propName: 'description',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.cleanUpString,
      ]),
    }],
  ]);
  return parseStdTable(sheet, columnMapping, 'TALENTS');
}

function getRulebookItemsGeneral(sheetName, tableName, tags = []) {
  const sheet = sheets.getSheet(HE2E_PATH, sheetName);
  const columnMapping = new Map([
    ['Name', {
      propName: 'name',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.cleanUpString,
        tfm.toTitleCase,
      ]),
    }],
    ['Effect', {
      propName: 'description',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.cleanUpString,
        tfm.toTitleCase,
      ]),
    }],
    ['Weight', {
      propName: 'weight',
      mappingFn: pipeline([
        sheets.cursorToText,
        str => str
          .replace(/,/g, '.')
          .replace(/[^0-9.]/g, ''),
        tfm.cleanUpString,
        tfm.toFloat,
      ]),
    }],
    ['Wrld/Faction', {
      propName: 'frequentIn',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.splitStringBy(','),
        tfm.cleanUpString,
        tfm.filterEmpty,
        tfm.toTitleCase,
      ]),
    }],
    ['Base Availability', {
      propName: 'availability',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.cleanUpString,
        tfm.toTitleCase,
      ]),
    }],
  ]);
  return parseStdTable(sheet, columnMapping, tableName)
    // Add a tag to an item
    .map(item => {
      return { ...item, tags };
    });
}

function getRulebookItemsWeapons(sheetName, tableName, weaponType, tags = []) {
  const sheet = sheets.getSheet(HE2E_PATH, sheetName);
  const columnMapping = new Map([
    ['Name', {
      propName: 'name',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.cleanUpString,
        tfm.toTitleCase,
      ]),
    }],
    ['Class', {
      stopOnEmpty: true,
      propName: 'weaponClass',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.cleanUpString,
      ]),
    }],
    ['Range', {
      propName: 'weaponRange',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.cleanUpString,
      ]),
    }],
    ['RoF', {
      propName: 'weaponRof',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.cleanUpString,
      ]),
    }],
    ['Dam', {
      propName: 'weaponDamage',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.cleanUpString,
      ]),
    }],
    ['Pen', {
      propName: 'weaponPen',
      mappingFn: pipeline([
        sheets.cursorToText,
        str => str.replace('PEN', ''),
        tfm.cleanUpString,
        tfm.toInteger,
      ]),
    }],
    ['Clip', {
      propName: 'weaponClip',
      mappingFn: pipeline([
        sheets.cursorToText,
        str => str.replace('*', ''),
        tfm.cleanUpString,
        tfm.toInteger,
      ]),
    }],
    ['Rld', {
      propName: 'weaponDamage',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.cleanUpString,
      ]),
    }],
    ['Special', {
      propName: 'qualities',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.splitStringBy(','),
        tfm.cleanUpString,
        tfm.filterEmpty,
        tfm.toTitleCase,
      ]),
    }],
    ['Wt', {
      propName: 'weight',
      mappingFn: pipeline([
        sheets.cursorToText,
        str => str
          .replace(/,/g, '.')
          .replace(/[^0-9.]/g, ''),
        tfm.cleanUpString,
        tfm.toFloat,
      ]),
    }],
    ['Frequent in', {
      propName: 'frequentIn',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.splitStringBy(','),
        tfm.cleanUpString,
        tfm.filterEmpty,
        tfm.toTitleCase,
      ]),
    }],
    ['Rare in', {
      propName: 'rareIn',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.splitStringBy(','),
        tfm.cleanUpString,
        tfm.filterEmpty,
        tfm.toTitleCase,
      ]),
    }],
    ['Availability', {
      propName: 'availability',
      mappingFn: pipeline([
        sheets.cursorToText,
        tfm.cleanUpString,
        tfm.toTitleCase,
      ]),
    }],
  ]);
  return parseStdTable(sheet, columnMapping, tableName)
    // Add a tag to an item
    .map(item => {
      return {
        ...item,
        weaponType,
        tags: [
          'Weapon',
          weaponType,
          item.weaponClass,
          ...tags,
        ],
      };
    });
}


//  HE2E standard tools for sheet parsing
// --------------------------------------------------------

/**
 * Standard HE2E table parser
 *
 * Table must consist of a "header" row, where the first row matches the first
 * column defined in "columnMapping", and a continuous space of data rows
 * following the header.
 *
 * Parser stops at the first empty row encountered.
 *
 * "textAnchor" is a piece of text which uniquely identifies the table, and
 * must be located on the first column of the table.
 *
 * "columnMapping" format:
 *
 *   new Map([
 *     [<column name>, {
 *       propName: <object property name>,
 *       mappingFn: cursor => <object property value>,
 *       stopFn: cursor => <boolean>, // Stops if function returns true
 *       stopOnEmpty: <boolean>, // Stops if cell is empty
 *     }],
 *   ]);
 *
 * @param  {Object} sheet Cheerio document (returned by sheets.getSheet).
 * @param  {Map} columnMapping
 * @param  {String} textAnchor Piece of text, which uniquely identifies the table.
 * @return {Object[]}
 */
function parseStdTable(sheet, columnMapping, textAnchor) {
  // Find the table (we're using the last cell, because these names are
  // usually repeated in table of contents).
  let cursor = sheets.findLastCellByText(sheet, textAnchor);
  // Get the first column name
  const firstColumnName = columnMapping.keys().next().value;
  // Try to find the table header
  while (true) {
    const str = tfm.cleanUpString(sheets.cursorToText(cursor));
    // We reached the header
    if (str === firstColumnName) {
      break;
    }
    // We reached the end
    if (!str) {
      return [];
    }
    // Go to the next row
    cursor = sheets.walkCursorDown(1)(cursor);
  }
  // Build a property list
  const propsColumns = [];
  let headerCursor = cursor;
  while (true) {
    if (!headerCursor) {
      break;
    }
    const columnName = tfm.cleanUpString(sheets.cursorToText(headerCursor));
    const prop = columnMapping.get(columnName);
    if (prop) {
      propsColumns.push([prop, headerCursor.x]);
    }
    headerCursor = sheets.walkCursorRight(1)(headerCursor);
  }
  // Map table onto objects
  const items = [];
  TABLE_MAPPER:
  while (cursor = sheets.walkCursorDown(1)(cursor)) {
    let localCursor = cursor;
    // Check for a default stop condition (empty string on first column)
    const str = sheets.cursorToText(localCursor);
    if (!str) {
      break;
    }
    // Create an empty item
    const item = {};
    // Iterate over propsColumns
    for (let [prop, column] of propsColumns) {
      // Move cursor to the prop column
      localCursor = localCursor.setX(column);
      const str = sheets.cursorToText(localCursor);
      // Check for a custom stop condition
      if (prop && prop.stopOnEmpty) {
        if (!str) {
          break TABLE_MAPPER;
        }
      }
      if (prop && prop.stopFn) {
        const condition = prop.stopFn(localCursor);
        if (condition) {
          break TABLE_MAPPER;
        }
      }
      // Map column onto object
      if (prop && prop.mappingFn) {
        item[prop.propName] = prop.mappingFn(localCursor);
      }
    }
    items.push(item);
  }
  return items;
}
