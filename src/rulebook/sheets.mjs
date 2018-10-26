import fs from 'fs';
import cheerio from 'cheerio';

/**
 * Get a sheet object. Returns a Cheerio object, which represents the sheet.
 *
 * @param  {Object} $ Cheerio object
 * @param  {any} predicate
 * @return {Cursor[]}
 */
export function getSheet(path, name) {
  const data = fs.readFileSync(`${path}/${name}.html`, 'utf8');
  return cheerio.load(data);
}

/**
 * Get the first cursor matching the given predicate.
 *
 * @param  {Object} $ Cheerio object
 * @param  {any} predicate
 * @return {Cursor[]}
 */
export function findFirstCellByText($, predicate) {
  const $elem = $('table tbody td');
  if ($elem.length === 0) {
    return;
  }
  for (let i = 0; i < $elem.length; i++) {
    const elem = $elem[i];
    if (!elem) {
      return;
    }
    const text = decodeHtmlEntities($(elem).html());
    const matching = typeof predicate === 'string' && text === predicate
      || typeof predicate === 'function' && predicate(text);
    if (matching) {
      return new Cursor($, elem);
    }
  }
}

/**
 * Get the last cursor matching the given predicate.
 *
 * @param  {Object} $ Cheerio object
 * @param  {any} predicate
 * @return {Cursor[]}
 */
export function findLastCellByText($, predicate) {
  const $elem = $('table tbody td');
  if ($elem.length === 0) {
    return;
  }
  for (let i = $elem.length - 1; i >= 0; i--) {
    const elem = $elem[i];
    if (!elem) {
      return;
    }
    const text = decodeHtmlEntities($(elem).html());
    const matching = typeof predicate === 'string' && text === predicate
      || typeof predicate === 'function' && predicate(text);
    if (matching) {
      return new Cursor($, elem);
    }
  }
}

/**
 * Get an array of cursors matching the given predicate.
 *
 * @param  {Object} $ Cheerio object
 * @param  {any} predicate
 * @return {Cursor[]}
 */
export function findManyCellsByText($, predicate) {
  const $elem = $('table tbody td');
  const cursors = [];
  for (let i = 0; i < $elem.length; i++) {
    const elem = $elem[i];
    if (!elem) {
      continue;
    }
    const text = decodeHtmlEntities($(elem).html());
    const matching = typeof predicate === 'string' && text === predicate
      || typeof predicate === 'function' && predicate(text);
    if (matching) {
      cursors.push(new Cursor($, elem));
    }
  }
  return cursors;
}

// Cursor walk transforms (see Cursor class)
export const walkCursorLeft = num => cursor => cursor && cursor.walkLeft(num);
export const walkCursorRight = num => cursor => cursor && cursor.walkRight(num);
export const walkCursorUp = num => cursor => cursor && cursor.walkUp(num);
export const walkCursorDown = num => cursor => cursor && cursor.walkDown(num);

// Cursor move transforms (see Cursor class)
export const moveCursorLeft = num => cursor => cursor && cursor.moveLeft(num);
export const moveCursorRight = num => cursor => cursor && cursor.moveRight(num);
export const moveCursorUp = num => cursor => cursor && cursor.moveUp(num);
export const moveCursorDown = num => cursor => cursor && cursor.moveDown(num);

// Cursor text transforms
export function cursorToText(cursor) {
  if (Array.isArray(cursor)) {
    return cursor.map(cursorToText);
  }
  return cursor && cursor.text();
}

export function cursorToHtml(cursor) {
  if (Array.isArray(cursor)) {
    return cursor.map(cursorToHtml);
  }
  return cursor && cursor.html();
}

/**
 * Retrieves rows as a list of values, starting at the provided
 * cursor position.
 *
 * @param  {Number} num Number of rows
 * @return {Function} Function which accepts the cursor object
 * and returns an array of cursors which represent the list.
 */
export function cursorToVerticalList(num) {
  return cursor => {
    const values = [];
    for (let i = 0; i < num; i++) {
      values.push(cursor);
      cursor = cursor.walkDown(1);
    }
    return values;
  };
}

/**
 * Retrieves columns as a list of values, starting at the provided
 * cursor position.
 *
 * @param  {Number} num Number of columns
 * @return {Function} Function which accepts the cursor object
 * and returns an array of cursors which represent the list.
 */
export function cursorToHorizontalList(num) {
  return cursor => {
    const values = [];
    for (let i = 0; i < num; i++) {
      values.push(cursor);
      cursor = cursor.walkRight(1);
    }
    return values;
  };
}

/**
 * Decodes HTML entities, and removes unnecessary HTML tags.
 *
 * @param  {String} str Encoded HTML string
 * @return {String} Decoded HTML string
 */
function decodeHtmlEntities(str) {
  if (!str) {
    return str;
  }
  const translate_re = /&(nbsp|amp|quot|lt|gt|apos);/g;
  const translate = {
    nbsp: ' ',
    amp:  '&',
    quot: '"',
    lt:   '<',
    gt:   '>',
    apos: '\'',
  };
  return str
    // Newline tags
    .replace(/<br>/gi, '\n')
    .replace(/<\/?[a-z0-9-_]+[^>]*>/gi, '')
    // Basic entities
    .replace(translate_re, (match, entity) => translate[entity])
    // Decimal entities
    .replace(/&#?([0-9]+);/gi, (match, numStr) => {
      const num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    })
    // Hex entities
    .replace(/&#x?([0-9a-f]+);/gi, (match, numStr) => {
      const num = parseInt(numStr, 16);
      return String.fromCharCode(num);
    });
}

/**
 * Cursor class
 */
export class Cursor {

  constructor($, elem) {
    // Set default coordinates
    this.x = 0;
    this.y = 0;
    // Set context
    if ($) {
      this.$ = $;
      this.tbody = $('table tbody').get(0);
      // Build cell matrix
      this.matrix = [];
      this.tbody.children.filter(x => x.tagName === 'tr')
        .forEach((row, rowIndex, rows) => {
          const matrixRow = [];
          const prevMatrixRow = this.matrix[rowIndex - 1];
          let currentX = 0;
          let currentY = rowIndex;
          row.children.filter(x => x.tagName === 'td')
            .forEach((cell, cellIndex, cells) => {
              const colSpan = parseInt(cell.attribs.colspan, 10) || 1;
              const rowSpan = parseInt(cell.attribs.rowspan, 10) || 1;
              const matrixCell = {
                x: currentX,
                y: currentY,
                w: colSpan,
                h: rowSpan,
                cell,
              };
              if (prevMatrixRow) {
                while (true) {
                  const prevMatrixCell = prevMatrixRow[currentX];
                  if (!prevMatrixCell) {
                    break;
                  }
                  const yMax = prevMatrixCell.y + prevMatrixCell.h;
                  if (currentY >= yMax) {
                    break;
                  }
                  matrixRow.push(prevMatrixCell);
                  currentX++;
                }
              }
              for (let i = 0; i < colSpan; i++) {
                matrixRow.push(matrixCell);
                currentX++;
              }
            });
          this.matrix.push(matrixRow);
        });
    }
    // Try to determine coordinates
    if (elem && elem.tagName === 'td') {
      let matrixCell = this.findMatrixCell(elem);
      if (matrixCell) {
        this.x = matrixCell.x;
        this.y = matrixCell.y;
      }
    }
  }

  clone(extraProps) {
    return Object.assign(new Cursor(), this, extraProps);
  }

  getMatrixCell() {
    const matrixRow = this.matrix[this.y];
    if (!matrixRow) {
      return null;
    }
    const matrixCell = matrixRow[this.x];
    if (!matrixCell) {
      return null;
    }
    return matrixCell;
  }

  findMatrixCell(cell) {
    for (let matrixRow of this.matrix) {
      for (let matrixCell of matrixRow) {
        if (matrixCell.cell === cell) {
          return matrixCell;
        }
      }
    }
    return null;
  }

  toJS() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  /**
   * Set cursor position.
   *
   * Cursor position is absolute.
   */
  set(x = 0, y = 0) {
    return this.clone({ x, y });
  }

  setX(x = 0) {
    return this.clone({ x, y: this.y });
  }

  setY(y = 0) {
    return this.clone({ x: this.x, y });
  }

  /**
   * Move cursor relative to current cursor position.
   *
   * Unlike "walk", this method moves the cursor in absolute coordinates of
   * the sheet, completely disregarding merged cells.
   */
  move(x = 0, y = 0) {
    return this.clone({
      x: Math.max(this.x + x, 0),
      y: Math.max(this.y + y, 0),
    });
  }

  moveUp(num = 1) {
    return this.move(0, -num);
  }

  moveRight(num = 1) {
    return this.move(num, 0);
  }

  moveDown(num = 1) {
    return this.move(0, num);
  }

  moveLeft(num = 1) {
    return this.move(-num, 0);
  }

  /**
   * Walk over merged cells in specified direction.
   *
   * Merged cells count as 1 cell, so if you walk over it, cursor will
   * jump to the coordinates of the next cell.
   */
  walk(x = 0, y = 0) {
    if (y > 0) {
      const box = this.getMatrixCell();
      return box && this.move(0, box.h).walk(x, y - 1);
    }
    if (y < 0) {
      const box = this.move(0, -1).getMatrixCell();
      return box && this.set(box.x, box.y).walk(x, y + 1);
    }
    if (x > 0) {
      const box = this.getMatrixCell();
      return box && this.move(box.w, 0).walk(x - 1, y);
    }
    if (x < 0) {
      const box = this.move(-1, 0).getMatrixCell();
      return box && this.set(box.x, box.y).walk(x + 1, y);
    }
    return this;
  }

  walkUp(num = 1) {
    return this.walk(0, -num);
  }

  walkRight(num = 1) {
    return this.walk(num, 0);
  }

  walkDown(num = 1) {
    return this.walk(0, num);
  }

  walkLeft(num = 1) {
    return this.walk(-num, 0);
  }

  /**
   * Get the cell at current cursor position
   */
  cell() {
    const $ = this.$;
    const matrixCell = this.getMatrixCell();
    return matrixCell
      ? $(matrixCell.cell)
      : $(null);
  }

  /**
   * Get text at current cursor position
   */
  text() {
    return decodeHtmlEntities(this.cell().html());
  }

  html() {
    return this.cell().html();
  }

  /**
   * Get rows at current cursor position
   */
  rows(num) {
    let cells = [];
    let cursor = this;
    for (let i = 0; i < num; i++) {
      cells.push(cursor.cell());
      cursor = cursor.move(0, 1);
    }
    return cells;
  }

  /**
   * Get columns at current cursor position
   */
  columns(num) {
    let cells = [];
    let cursor = this;
    for (let i = 0; i < num; i++) {
      cells.push(cursor.cell());
      cursor = cursor.move(1, 0);
    }
    return cells;
  }

}
