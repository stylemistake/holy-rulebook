const {
  compose,
  toTitleCase,
  toIdentifier,
  splitStringBy,
  cleanUpString,
} = require('../transforms.js');

module.exports = {
  type: "talents",
  marker: "td.s50, td.s60",
  sourceFile: "TALE.html",
  containerMarker: "table tbody",
  attributes: [
    {
      name: "name",
      type: "text",
      transform: compose(cleanUpString, toTitleCase),
      marker: "td.s50, td.s60",
      horizontalOffset: -5,
    },
    {
      name: "prerequisites",
      type: "text",
      transform: compose(splitStringBy(','), cleanUpString),
      marker: "td.s50, td.s60",
      horizontalOffset: -4,
    },
    {
      name: "tier",
      type: "text",
      marker: "td.s50, td.s60",
      horizontalOffset: -3,
    },
    {
      name: "aptitudes",
      type: "set",
      transform: compose(cleanUpString, toTitleCase),
      count: 2,
      direction: "horizontal",
      marker: "td.s50, td.s60",
      horizontalOffset: -2,
    },
    {
      name: "description",
      type: "html",
      transform: cleanUpString,
      marker: "td.s50, td.s60",
    },
  ]
};
