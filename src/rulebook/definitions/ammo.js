const {
  compose,
  toTitleCase,
  toIdentifier,
  splitStringBy,
  filterContentBy,
  cleanUpString,
} = require('../transforms.js');

module.exports = {
  type: "ammo",
  marker: "td.s212.softmerge",
  sourceFile: "WPNS.html",
  containerMarker: "table tbody",
  handler: "single",
  attributes: [
    {
      name: "ammo",
      type: "set",
      marker: "td.s49",
      stopMarker: "td.s242",
      direction: "vertical",
      attributes: [
        {
          name: "name",
          type: "text",
          marker: "td.s49",
        },
        {
          name: "weapons",
          type: "html",
          transform: compose(splitStringBy(','), cleanUpString, toTitleCase),
          marker: "td.s49",
          horizontalOffset: 5,
        },
        {
          name: "effects",
          type: "html",
          transform: compose(splitStringBy(','), cleanUpString, toTitleCase),
          marker: "td.s49",
          horizontalOffset: 6,
        }
      ]
    },
  ]
};
