module.exports = {
  type: "talents",
  marker: "td.s50, td.s60",
  sourceFile: "TALE.html",
  containerMarker: "table tbody",
  attributes: [
    {
      name: "name",
      type: "text",
      marker: "td.s50, td.s60",
      horizontalOffset: -5,
    },
    {
      name: "prerequisites",
      type: "text",
      seperator: ",",
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
      count: 2,
      direction: "horizontal",
      marker: "td.s50, td.s60",
      horizontalOffset: -2,
    },
    {
      name: "description",
      type: "html",
      marker: "td.s50, td.s60",
    },
  ]
};