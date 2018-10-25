import fs from 'fs';
import cheerio from 'cheerio';

export function getSheet(path, name) {
  const data = fs.readFileSync(`${path}/${name}.html`, 'utf8');
  return cheerio.load(data);
}

export function findFirstCellByText($, predicate) {
  const $elem = $('table tbody').find(`td:contains("${predicate}")`);
  const elem = $elem.get(0);
  if (!elem) {
    return;
  }
  return new Cursor($, elem);
}

export function findLastCellByText($, predicate) {
  const $elem = $('table tbody').find(`td:contains("${predicate}")`);
  const elem = $elem.last().get(0);
  if (!elem) {
    return;
  }
  return new Cursor($, elem);
}

export function findManyCellsByText($, predicate) {
  const cursors = [];
  $('table tbody').find(`td:contains("${predicate}")`)
    .each((i, elem) => {
      cursors.push(new Cursor($, elem));
    });
  return cursors;
}

export function cursorToUniformTable(cursor) {
  const cursors = [];
  while (true) {
    const str = cursorToText(cursor);
    // Check if we reached an end of the table
    if (!str) {
      break;
    }
    cursors.push(cursor);
    // Move cursor
    cursor = cursor.walkDown(1);
  }
  return cursors;
}

export const walkCursorLeft = num => cursor => cursor.walkLeft(num);
export const walkCursorRight = num => cursor => cursor.walkRight(num);
export const walkCursorUp = num => cursor => cursor.walkUp(num);
export const walkCursorDown = num => cursor => cursor.walkDown(num);

export const moveCursorLeft = num => cursor => cursor.moveLeft(num);
export const moveCursorRight = num => cursor => cursor.moveRight(num);
export const moveCursorUp = num => cursor => cursor.moveUp(num);
export const moveCursorDown = num => cursor => cursor.moveDown(num);

export const cursorToText = cursor => decodeHtmlEntities(cursor.cell().html());
export const cursorToHtml = cursor => cursor.cell().html();

export function cursorToVerticalListOfValues(num) {
  return cursor => {
    const values = [];
    for (let i = 0; i < num; i++) {
      values.push(cursor.text());
      cursor = cursor.moveDown(1);
    }
    return values;
  };
}

function decodeHtmlEntities(str) {
  const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  const translate = {
    nbsp: " ",
    amp:  "&",
    quot: "\"",
    lt:   "<",
    gt:   ">",
  };
  return str
    // Newline tags
    .replace(/<br>/gi, '\n')
    .replace(/<\/?span[^>]*>/gi, '')
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

  /**
   * Move cursor relative to current cursor position.
   *
   * Cursor position is absolute.
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
   * Walk over the cells in specified direction.
   *
   * Merged cells counts as 1 cell, so if you walk over it, cursor will
   * jump to the coordinates of the next cell.
   *
   * You can use it to navigate the table,
   */
  walk(x = 0, y = 0) {
    if (y > 0) {
      const box = this.getMatrixCell();
      return this.move(0, box.h).walk(x, y - 1);
    }
    if (y < 0) {
      const box = this.move(0, -1).getMatrixCell();
      return this.set(box.x, box.y).walk(x, y + 1);
    }
    if (x > 0) {
      const box = this.getMatrixCell();
      return this.move(box.w, 0).walk(x - 1, y);
    }
    if (x < 0) {
      const box = this.move(-1, 0).getMatrixCell();
      return this.set(box.x, box.y).walk(x + 1, y);
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
    return this.cell().text();
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
