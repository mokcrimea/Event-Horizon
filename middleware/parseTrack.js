var libxmljs = require("libxmljs");
var fs = require('fs');

exports.parse = function(Data, callback) {
  var theTrackArray = [],
    theTimeArray = [];
  var gpxInXml = Data.toString(),
    positionOfGpxTag = gpxInXml.indexOf('<metadata>');
  //Remove form *.gpx file unused parameters
  gpxInXml = '<?xml version="1.0" encoding="utf-8"?>\n<gpx>\n' + gpxInXml.substr(positionOfGpxTag);

  var xmlDoc = libxmljs.parseXml(gpxInXml),
    coordinateData = xmlDoc.child(3).child(1).childNodes(),
    coordinateX, coordinateY, timeCreate, timeFormated;

  for (var i = 1; i < coordinateData.length; i += 2) {
    coordinateX = coordinateData[i].attr('lat').value();
    coordinateY = coordinateData[i].attr('lon').value();
    timeCreate = new Date(coordinateData[i].child(3).text());
    // timeFormated = timeCreate.getHours() + ':' + timeCreate.getMinutes();
    theTrackArray.push([parseFloat(coordinateX), parseFloat(coordinateY)]);
    theTimeArray.push(timeCreate);
  }
  return callback(theTrackArray, theTimeArray);

};
