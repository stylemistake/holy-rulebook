const fs = require('fs');
const cheerio = require('cheerio');

class Converter {

  constructor(definitions, rulebookDirectory) {
    this.definitions = definitions;
    this.rulebookDirectory = rulebookDirectory;
    this.baseHandler = this.baseHandler.bind(this);
  }

  applyOffset(offset, baseElement) {
    let element = baseElement;
    let counter = 0;
    while (counter !== offset) {
      if (offset > 0) {
        element = element.next();
        counter++;
      } else {
        element = element.prev();
        counter--;
      }
    }
    return element;
  }

  //TODO decompose this functionality into class
  processAttribure(baseDefinition, object, baseRow) {
    let row = baseRow;
    let definition = Object.assign({}, baseDefinition);
    if (definition.verticalOffset) {
      row = this.applyOffset(definition.verticalOffset, baseRow);
    }
    if (['text', 'html', 'encodedSet'].includes(definition.type)) {
      object[definition.name] = this.extractValue(definition, this.getValue(definition, row));
    } else if (['set'].includes(definition.type)) {
      //TODO handle horizontal set direction
      if (definition.count || definition.stopMarker) {
        let finished = false;
        let counter = 1;
        const limiter = 100;
        object[definition.name] = [];
        while (!finished) {
          if (
            (definition.count && definition.count === counter) ||
            (definition.stopMarker && row.children(definition.stopMarker).length > 0) ||
            (counter === limiter)
            ) {
            finished = true;
          }
          const value = this.getValue(definition, row);
          if (this.checkIfValueMatches(definition, value)) {
            if (definition.attributes) {
              let newNestedObject = {};
              object[definition.name].push(newNestedObject);
              definition.attributes.map(attribute => {
                this.processAttribure(attribute, newNestedObject, row);
              });
            } else {
              object[definition.name].push(this.extractValue(definition, value));
            }
          }
          counter++;
          if (definition.direction === 'horizontal') {
            definition.horizontalOffset = definition.horizontalOffset ? definition.horizontalOffset + 1 : 1;
          } else {
            row = row.next();
          }
        }
      } else {
        console.error(`Attribute ${definition.type} is "set" but has no count nor stop marker.`);
      }
    } else {
      console.error(`Unknown attribute type: ${definition.type}.`);
    }
  }

  //TODO decompose this functionality into class
  getValue(definition, row) {
    let element = row.children(definition.marker).first();
    if (definition.horizontalOffset) {
      element = this.applyOffset(definition.horizontalOffset, element);
    }
    if (definition.type === 'html') {
      return element.html() ? element.html() : element.text();
    }
    return element.text();
  }

  //TODO decompose this functionality into class
  checkIfValueMatches(definition, value) {
    if (value.trim()) {
      if (definition.contentMatcher) {
        const regexp = new RegExp(definition.contentMatcher);
        if (regexp.test(value)) {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  }

  //TODO decompose this functionality into class
  extractValue(definition, text) {
    let value = text;
    if (definition.seperator) {
      value = value.split(definition.seperator).map(string => string.trim().toLowerCase());
    } else if (definition.type !== 'html') {
      value = value.trim().toLowerCase().replace('†', '');
      if (definition.contentFilter) {
        const match = value.match(definition.contentFilter);
        if(match){
          value = match[0];
        }
      }
    } else {
      //TODO maybe encode html and/or wrap in some tag
    }
    return value;
  }

  //TODO move handlers to seperate classes
  baseHandler(definition) {
    const data = fs.readFileSync(`${this.rulebookDirectory}${definition.sourceFile}`, 'utf8');
    const sheet = cheerio.load(data);
    const skills = [];
    sheet(definition.containerMarker).find(definition.marker).each((index, element) => {
      const baseRow = sheet(element).parent();
      let skill = {};
      for (let i = 0; i < definition.attributes.length; i++) {
        this.processAttribure(definition.attributes[i], skill, baseRow);
      }
      skills.push(skill);
    });
    return skills;
  }

  handlers() {
    return {
      skills: this.baseHandler,
      talents: this.baseHandler,
      weapons: this.baseHandler,
    }
  }

  convert() {
    let rulebook = {};
    this.definitions.map(definition => {
      rulebook[definition.type] = this.handlers()[definition.type](definition);
    });
    return rulebook;
  }

}

module.exports = Converter;