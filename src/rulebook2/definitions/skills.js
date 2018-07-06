module.exports = {
  type: "skills",
  marker: "td.s27",
  sourceFile: "SKLS.html",
  containerMarker: "table tbody",
  attributes: [
    {
      name: "name",
      type: "text",
      marker: "td.s27",
    },
    {
      name: "description",
      type: "html",
      marker: "td.s30",
      verticalOffset: 1,
    },
    {
      name: "examples",
      type: "html",
      marker: "td.s30",
      horizontalOffset: 1,
      verticalOffset: 1,
    },
    {
      name: "characteristic",
      type: "text",
      marker: "td.s32",
      verticalOffset: 2,
    },
    {
      name: "aptitudes",
      type: "set",
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
      name: "specialisations",
      type: "set",
      attributes: [
        {
          name: "specialisation",
          type: "text",
          marker: "td.s11",
        },
        {
          name: "desciption",
          type: "html",
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
          name: "subskill",
          type: "text",
          marker: "td.s11",
        },
        {
          name: "desciption",
          type: "html",
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