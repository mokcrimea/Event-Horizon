var libxmljs = require("libxmljs");
var fs = require('fs');
  
fs.readFile('track1.gpx', function (err, logData) {

  if (err) throw err;

  var xmlTrack = logData.toString(),
      positionGpx = xmlTrack.indexOf('<metadata>');

  // Убираем из gps трека некорретные для модуля аттрибуты тега
  xmlTrack = '<?xml version="1.0" encoding="utf-8"?>\n<gpx>\n' + xmlTrack.substr(positionGpx);;

  // Парсим трек модулем
  var xmlDoc = libxmljs.parseXml(xmlTrack),
      coordinateData = xmlDoc.child(3).child(1).childNodes(),
      coordinateX, coordinateY, timeCreate;

  for (var i = 1; i < coordinateData.length; i += 2){
    coordinateX = coordinateData[i].attr('lat').value();
    coordinateY = coordinateData[i].attr('lon').value();
    timeCreate = coordinateData[i].child(3).text();
  }

});