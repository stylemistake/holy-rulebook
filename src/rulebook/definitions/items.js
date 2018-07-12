const {
  compose,
  toTitleCase,
  toIdentifier,
  splitStringBy,
  filterContentBy,
  cleanUpString,
} = require('../transforms.js');

//TODO remove "," from weight, more markers, bionics
module.exports = {
  type: "items",
  marker: "td.s35, td.s63",
  sourceFile: "ITM.html",
  containerMarker: "table tbody",
  attributes: [
    {
      name: "name",
      type: "text",
      marker: "td.s33, td.s30",
      horizontalOffset: 1,
      transform: cleanUpString,
    },
    {
      name: "description",
      type: "html",
      marker: "td.s33, td.s30",
      horizontalOffset: 2,
    },
    {
      name: "weight",
      type: "text",
      transform: filterContentBy('[0-9.,]+'),
      marker: "td.s33, td.s30",
      horizontalOffset: 3,
    },
    {
      name: "baseAvailability",
      type: "text",
      marker: "td.s57, td.s55, td.s44, td.s53, td.s39, td.s42, td.s130, td.s47, td.s60",
      transform: cleanUpString,
    },
    {
      name: "adjustedAvailability",
      type: "text",
      marker: "td.s58, td.s56, td.s45, td.s54, td.s40, td.s131, td.s48, td.s61",
      transform: cleanUpString,
    },
  ]
};
