module.exports = {
  type: "weapons",
  marker: "td.s48",
  sourceFile: "WPNS.html",
  containerMarker: "table tbody",
  attributes: [
    {
      name: "name",
      type: "text",
      marker: "td.s49",
    },
    {
      name: "class",
      type: "text",
      marker: "td.s49",
      seperator: ",",
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
      seperator: "/",
      horizontalOffset: 3,
    },
    {
      name: "damage",
      type: "text",
      marker: "td.s49",
      contentFilter: "[0-9]+d[0-9]+([+-][0-9]+)?",
      horizontalOffset: 4,
    },
    {
      name: "damageType",
      type: "text",
      marker: "td.s49",
      contentFilter: "[rxie]$",
      horizontalOffset: 4,
    },
    {
      name: "penetration",
      type: "text",
      marker: "td.s49",
      contentFilter: "[0-9]+",
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
      marker: "td.s49",
      horizontalOffset: 7,
    },
    {
      name: "qualities",
      type: "text",
      marker: "td.s49",
      seperator: ",",
      horizontalOffset: 8,
    },
    {
      name: "weight",
      type: "text",
      marker: "td.s49",
      contentFilter: "[0-9.]+",
      horizontalOffset: 9,
    },
  ]
};