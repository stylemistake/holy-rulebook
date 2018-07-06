const fs = require('fs');
const cheerio = require('cheerio');

class Converter {

  constructor(definitions, rulebookDirectory) {
    this.definitions = definitions;
    this.rulebookDirectory = rulebookDirectory;
  }

  processAttribure(definition, object, baseRow) {
    let row = baseRow;
    if (definition.verticalOffset) {
      let counter = 0;
      while (counter !== definition.verticalOffset) {
        if (definition.verticalOffset > 0) {
          row = row.next();
          counter++;
        } else {
          row = row.prev();
          counter--;
        }
      }
    }
    if (['text', 'html'].includes(definition.type)) {
      object[definition.name] = this.extractValue(definition, row);
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
          if (this.checkIfValueMatches(definition, row)) {
            if (definition.attributes) {
              let newNestedObject = {};
              object[definition.name].push(newNestedObject);
              definition.attributes.map(attribute => {
                this.processAttribure(attribute, newNestedObject, row);
              });
            } else {
              object[definition.name].push(this.extractValue(definition, row));
            }
          }
          counter++;
          row = row.next();
        }
      } else {
        console.error(`Attribute ${definition.type} is "set" but has no count nor stop marker.`);
      }
    } else {
      console.error(`Unknown attribute type: ${definition.type}.`);
    }
  }

  //TODO decompose this functionality into class
  checkIfValueMatches(definition, row) {
    const horizontalOffset = definition.horizontalOffset ? definition.horizontalOffset : 0;
    let value = row.children(definition.marker).eq(horizontalOffset).text();
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
  extractValue(definition, row) {
    const horizontalOffset = definition.horizontalOffset ? definition.horizontalOffset : 0;
    let value = row.children(definition.marker).eq(horizontalOffset).text();
    if (definition.type !== 'html') {
      value = value.trim().toLowerCase().replace('†', '');
    } else {
      //TODO maybe encode html and/or wrap in some tag
    }
    return value;
  }

  handlers() {
    //TODO move handlers to seperate classes
    return {
      skills: (definition) => {
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