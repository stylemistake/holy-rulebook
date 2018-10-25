import { compose, chain, pipeline } from './functional.mjs';
import * as sheets from './sheets.mjs';
import * as tfm from './transform.mjs';

const HE2E_PATH = 'src/rulebook/HE2E';

export function getRulebook() {
  getRulebookTalents(sheets.getSheet(HE2E_PATH, 'TALE'))
  return {
    skills: getRulebookSkills(sheets.getSheet(HE2E_PATH, 'SKLS')),
    talents: getRulebookTalents(sheets.getSheet(HE2E_PATH, 'TALE')),
    items: [
      ...getRulebookItemsGeneral(sheets.getSheet(HE2E_PATH, 'ITM')),
    ],
  };
}

/**
 * Parses skill cards within SKLS sheet.
 *
 * @param  {Object} sheet Cheerio document (returned by sheets.getSheet).
 * @return {Object[]} Array of skill objects.
 */
function getRulebookSkills(sheet) {
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
          sheets.cursorToVerticalListOfValues(2),
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
          sheets.cursorToText,
          tfm.cleanUpString,
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
      ])(cursor),
    };
    // Push subskill
    if (isSpecialization) {
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

function getRulebookTalents(sheet) {
  const cursor = sheets.findFirstCellByText(sheet, 'Aptitude 1')
    .walkLeft(3)
    .walkDown(1);
  return sheets.cursorToUniformTable(cursor)
    .map(cursor => {
      return {
        name: pipeline([
          sheets.cursorToText,
          tfm.cleanUpString,
          tfm.toTitleCase,
        ])(cursor),
        prerequisites: pipeline([
          sheets.walkCursorRight(1),
          sheets.cursorToText,
          tfm.cleanUpString,
        ])(cursor),
        tier: pipeline([
          sheets.walkCursorRight(2),
          sheets.cursorToText,
          tfm.toInteger,
        ])(cursor),
        aptitudes: [
          pipeline([
            sheets.walkCursorRight(3),
            sheets.cursorToText,
            tfm.cleanUpString,
            tfm.toTitleCase,
          ])(cursor),
          pipeline([
            sheets.walkCursorRight(4),
            sheets.cursorToText,
            tfm.cleanUpString,
            tfm.toTitleCase,
          ])(cursor),
        ],
        description: pipeline([
          sheets.walkCursorRight(5),
          sheets.cursorToText,
          tfm.cleanUpString,
        ])(cursor),
      };
    });
}

/**
 * Parses items within ITM sheet.
 *
 * @param  {Object} sheet Cheerio document (returned by sheets.getSheet).
 * @return {Object[]} Array of item objects.
 */
function getRulebookItemsGeneral(sheet) {
  const columnMapping = new Map([
    // Generic properties
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
        tfm.cleanUpString,
        str => str.replace(/,/g, '.')
          .replace(/[^0-9.]/g, ''),
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
    // // Weapon properties
    // ['Class', 'weaponClass'],
    // ['Range', 'weaponRange'],
    // ['RoF', 'weaponRof'],
    // ['Dam', 'weaponDamage'],
    // ['Pen', 'weaponPen'],
    // ['Clip', 'weaponClip'],
    // ['Rld', 'weaponReload'],
    // // Armor properties
    // ['Armour Type', 'armorClass'],
    // ['Location(s) Covered', 'armorLocations'],
    // ['AP', 'armorPoints'],
  ]);
  return [
    ...parseStdTable(sheet, columnMapping, 'CAPACITY ITEMS')
      .map(item => {
        return { ...item, tags: ['Capacity'] };
      }),
    ...parseStdTable(sheet, columnMapping, 'CLOTHING')
      .map(item => {
        return { ...item, tags: ['Clothing'] };
      }),
    ...parseStdTable(sheet, columnMapping, 'WEARABLES')
      .map(item => {
        return { ...item, tags: ['Wearables'] };
      }),
    ...parseStdTable(sheet, columnMapping, 'SPECIALIZATION KITS AND PACKAGES')
      .map(item => {
        return { ...item, tags: ['Kits'] };
      }),
    ...parseStdTable(sheet, columnMapping, 'STAND-ALONE TOOLS')
      .map(item => {
        return { ...item, tags: ['Tools'] };
      }),
    ...parseStdTable(sheet, columnMapping, 'PSYKER AND WITCH HANDLER ITEMS')
      .map(item => {
        return { ...item, tags: ['Psyker'] };
      }),
    ...parseStdTable(sheet, columnMapping, 'EXPLOSIVES AND TRAPS')
      .map(item => {
        return { ...item, tags: ['Explosives'] };
      }),
    ...parseStdTable(sheet, columnMapping, 'CAMPING AND FORTIFICATION SUPPLY')
      .map(item => {
        return { ...item, tags: ['Camping'] };
      }),
    ...parseStdTable(sheet, columnMapping, 'BOOKS AND DOCUMENTS')
      .map(item => {
        return { ...item, tags: ['Books'] };
      }),
    ...parseStdTable(sheet, columnMapping, 'DRUGS, CONSUMABLES and MEDICINE (non-food)')
      .map(item => {
        return { ...item, tags: ['Drugs'] };
      }),
    ...parseStdTable(sheet, columnMapping, 'FOOD, RATIONS and ALCOHOL')
      .map(item => {
        return { ...item, tags: ['Food'] };
      }),
    ...parseStdTable(sheet, columnMapping, 'BIONICS')
      .map(item => {
        return { ...item, tags: ['Bionics'] };
      }),
  ];
}

/**
 * Standard HE2E table parser
 *
 * Table must consist of a "header" row, which begins with a "Name" column,
 * and a continuous space of data rows following the header.
 *
 * Stops parsing at the first empty row encountered.
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
 *     }],
 *   ]);
 *
 * @param  {Object} sheet Cheerio document (returned by sheets.getSheet).
 * @param  {Map} columnMapping
 * @param  {String} textAnchor Piece of text, which uniquely identifies the table.
 * @return {Object[]}
 */
function parseStdTable(sheet, columnMapping, textAnchor) {
  let cursor = sheets.findLastCellByText(sheet, textAnchor);
  // Try to find the table header
  while (true) {
    const str = tfm.cleanUpString(sheets.cursorToText(cursor));
    // We reached the header
    if (str === 'Name') {
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
  const props = [];
  let headerCursor = cursor;
  while (true) {
    const columnName = tfm.cleanUpString(sheets.cursorToText(headerCursor));
    if (!columnName) {
      break;
    }
    const prop = columnMapping.get(columnName);
    props.push(prop);
    headerCursor = sheets.walkCursorRight(1)(headerCursor);
  }
  // Map table onto objects
  cursor = sheets.walkCursorDown(1)(cursor);
  return sheets.cursorToUniformTable(cursor)
    .map(cursor => {
      const item = {};
      // Iterate over props
      for (let prop of props) {
        // Map column onto object
        if (prop) {
          item[prop.propName] = prop.mappingFn(cursor);
        }
        // Move cursor to the next column
        cursor = sheets.walkCursorRight(1)(cursor);
      }
      return item;
    });
}
