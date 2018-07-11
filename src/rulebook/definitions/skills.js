const {
  compose,
  toTitleCase,
  toIdentifier,
  splitStringBy,
  cleanUpString,
} = require('../transforms.js');

module.exports = {
  type: "skills",
  marker: "td.s27",
  sourceFile: "SKLS.html",
  containerMarker: "table tbody",
  attributes: [
    {
      name: "id",
      type: "text",
      transform: toIdentifier,
      marker: "td.s27",
    },
    {
      name: "name",
      type: "text",
      transform: compose(cleanUpString, toTitleCase),
      marker: "td.s27",
    },
    {
      name: "description",
      type: "html",
      transform: cleanUpString,
      marker: "td.s30",
      verticalOffset: 1,
    },
    {
      name: "examples",
      type: "html",
      transform: compose(splitStringBy('<br>'), cleanUpString),
      marker: "td.s30",
      horizontalOffset: 1,
      verticalOffset: 1,
    },
    {
      name: "characteristic",
      type: "text",
      transform: compose(cleanUpString, toTitleCase),
      marker: "td.s32",
      verticalOffset: 2,
    },
    {
      name: "aptitudes",
      type: "set",
      transform: compose(cleanUpString, toTitleCase),
      count: 2,
      direction: "vertical",
      marker: "td.s34",
      verticalOffset: 4,
    },
    {
      name: "time",
      type: "text",
      marker: "td.s35",
      verticalOffset: 4,
    },
    {
      name: "specializations",
      type: "set",
      attributes: [
        {
          name: "name",
          type: "text",
          transform: compose(cleanUpString, toTitleCase),
          marker: "td.s11",
        },
        {
          name: "desciption",
          type: "html",
          transform: cleanUpString,
          marker: "td.s30, td.s54",
        },
      ],
      verticalOffset: 6,
      direction: "vertical",
      marker: "td.s11",
      contentMatcher: "†$",
      stopMarker: "td.s27",
    },
    {
      name: "subskills",
      type: "set",
      attributes: [
        {
          name: "name",
          type: "text",
          transform: compose(cleanUpString, toTitleCase),
          marker: "td.s11",
        },
        {
          name: "desciption",
          type: "html",
          transform: cleanUpString,
          marker: "td.s30, td.s35",
        },
      ],
      verticalOffset: 6,
      direction: "vertical",
      marker: "td.s11",
      contentMatcher: "^((.)(?!†))*†{0}$",
      stopMarker: "td.s27",
    }
  ]
};
