const {
  compose,
  toTitleCase,
  toIdentifier,
  splitStringBy,
  filterContentBy,
  cleanUpString,
} = require('../transforms.js');

module.exports = {
  type: "weapons",
  marker: "td.s48",
  sourceFile: "WPNS.html",
  containerMarker: "table tbody",
  attributes: [
    {
      name: "name",
      type: "text",
      transform: compose(cleanUpString, toTitleCase),
      marker: "td.s49",
    },
    {
      name: "class",
      type: "text",
      transform: compose(splitStringBy(','), cleanUpString, toTitleCase),
      marker: "td.s49",
      horizontalOffset: 1,
    },
    {
      name: "range",
      type: "text",
      marker: "td.s49",
      horizontalOffset: 2,
    },
    {
      name: "rateOfFire",
      type: "text",
      marker: "td.s49",
      transform: compose(cleanUpString, splitStringBy('/')),
      horizontalOffset: 3,
    },
    {
      name: "damage",
      type: "text",
      transform: filterContentBy('[0-9]+d[0-9]+([+-][0-9]+)?'),
      marker: "td.s49",
      horizontalOffset: 4,
    },
    {
      name: "damageType",
      type: "text",
      transform: filterContentBy('[rxie]$'),
      marker: "td.s49",
      horizontalOffset: 4,
    },
    {
      name: "penetration",
      type: "text",
      transform: filterContentBy('[0-9]+'),
      marker: "td.s49",
      horizontalOffset: 5,
    },
    {
      name: "capacity",
      type: "text",
      marker: "td.s49",
      horizontalOffset: 6,
    },
    {
      name: "reloadTime",
      type: "text",
      transform: cleanUpString,
      marker: "td.s49",
      horizontalOffset: 7,
    },
    {
      name: "qualities",
      type: "text",
      marker: "td.s49",
      separator: ",",
      horizontalOffset: 8,
    },
    {
      name: "weight",
      type: "text",
      transform: filterContentBy('[0-9.]+'),
      marker: "td.s49",
      horizontalOffset: 9,
    },
  ]
};
