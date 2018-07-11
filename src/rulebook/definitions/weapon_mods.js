const {
  compose,
  toTitleCase,
  toIdentifier,
  splitStringBy,
  filterContentBy,
  cleanUpString,
} = require('../transforms.js');

module.exports = {
  type: "weapon_mods",
  marker: "td.s244.softmerge",
  sourceFile: "WPNS.html",
  containerMarker: "table tbody",
  contentMatcher: "^((?!rules).)*$",
  attributes: [
    {
      name: "classes",
      type: "text",
      marker: "td.s244.softmerge",
      transform: compose(splitStringBy(" "), filterContentBy("(Melee|Ranged)")),
    },
    {
      name: "mods",
      type: "set",
      marker: "td.s49",
      stopMarker: "td.s244.softmerge",
      direction: "vertical",
      verticalOffset: 1,
      attributes: [
        {
          name: "name",
          type: "text",
          marker: "td.s49",
        },
        {
          name: "type",
          type: "text",
          marker: "td.s49",
          horizontalOffset: 1,
        },
        {
          name: "weight",
          type: "text",
          marker: "td.s49",
          horizontalOffset: 2,
        },
        {
          name: "description",
          type: "html",
          marker: "td.s49",
          horizontalOffset: 8,
        },
        {
          name: "weapons",
          type: "text",
          separator: ",",
          marker: "td.s49",
          horizontalOffset: 9,
        },
      ]
    },
  ]
};
