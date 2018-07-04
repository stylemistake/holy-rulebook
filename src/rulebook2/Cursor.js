class Cursor {

  constructor($, elem) {
    // Set default coordinates
    this.x = 0;
    this.y = 0;
    // Set context
    if ($) {
      this.$ = $;
      this.tbody = $('table tbody').get(0);
    }
    // Try to determine coordinates
    if (elem) {
      let cell = null;
      let row = null;
      if (elem.tagName === 'td') {
        cell = elem;
        row = elem.parent;
      }
      else if (elem.tagName === 'tr') {
        row = elem;
      }
      // Set X coordinate
      if (cell) {
        this.x = 0;
        let current = cell.prev;
        while (true) {
          // Break when reached end
          if (!current || current.tagName === 'th') {
            break;
          }
          // Add width of the cell
          this.x += parseInt(current.attribs.colspan, 10) || 1;
          // Get previous cell
          current = current.prev;
        }
      }
      // Set Y coordinate
      if (row) {
        this.y = this.tbody.children
          .filter(x => x.tagName === 'tr')
          .indexOf(row);
      }
    }
  }

  clone(extraProps) {
    return Object.assign(new Cursor(), this, extraProps);
  }

  toJS() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  /**
   * Set cursor position.
   */
  set(x = 0, y = 0) {
    return this.clone({ x, y });
  }

  /**
   * Move cursor relative to current cursor position.
   */
  move(x = 0, y = 0) {
    return this.clone({
      x: Math.max(this.x + x, 0),
      y: Math.max(this.y + y, 0),
    });
  }

  /**
   * Walk over cells in specified direction.
   *   - Honors merged cells.
   *   - Walks vertically first, then horizontally.
   *
   * NOTE: Very hacky solution, but hey, it FUCKING WORKS!
   */
  walk(x = 0, y = 0) {
    if (y > 0) {
      const rowSpan = parseInt(this.cell().attr('rowspan'), 10) || 1;
      return this.move(0, rowSpan).walk(x, y - 1);
    }
    // TODO: Walking up doesn't work yet.
    // if (y < 0) {
    //   const nextCell = this.move(0, -1).cell().get(0);
    //   return new Cursor(this.$, nextCell).walk(x, y + 1);
    // }
    if (x > 0) {
      const colSpan = parseInt(this.cell().attr('colspan'), 10) || 1;
      return this.move(colSpan, 0).walk(x - 1, y);
    }
    if (x < 0) {
      const nextCell = this.move(-1, 0).cell().get(0);
      return new Cursor(this.$, nextCell).walk(x + 1, y);
    }
    return this;
  }

  /**
   * Get a cell at current cursor position
   */
  cell() {
    const $ = this.$;
    const row = this.tbody.children.filter(x => x.tagName === 'tr')[this.y];
    if (!row) {
      return $(null);
    }
    const cells = row.children.filter(x => x.tagName === 'td');
    let currentX = 0;
    for (let i = 0; i < cells.length; i++) {
      const colSpan = parseInt(cells[i].attribs.colspan, 10) || 1;
      if (this.x === currentX || this.x > currentX && this.x < currentX + colSpan) {
        return $(cells[i]);
      }
      currentX += colSpan;
    }
    return $(null);
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

module.exports = Cursor;
