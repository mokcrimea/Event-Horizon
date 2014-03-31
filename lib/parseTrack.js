var libxmljs = require("libxmljs");
var fs = require('fs');

function parse(Data, path, callback) {

  var theTrackArray = [],
    theFullTrack = [];
  var gpxInXml = Data.toString(),
    positionOfGpxTag = gpxInXml.indexOf('<trk>');
  var theFirstTag;


  //Удаляем из файла неиспользуемые параметры из-за которых крешится парсер.
  gpxInXml = '<?xml version="1.0" encoding="utf-8"?>\n<gpx>\n' + gpxInXml.substr(positionOfGpxTag);

  var isTimePresent = true,
    isHeightPresent = true;



  var xmlDoc;
  try {
    xmlDoc = libxmljs.parseXml(gpxInXml);
  } catch (err) {
    return callback(err);
  }

  var coordinateData = xmlDoc.get('//trkseg').childNodes(),
    coordinateX, coordinateY, timeCreate, height, timeFormated;
  var theDistance;

  for (var i = 1; i < coordinateData.length; i += 8) {

    coordinateX = coordinateData[i].attr('lat').value();
    coordinateY = coordinateData[i].attr('lon').value();
    if (isTimePresent) {
      try {
        timeCreate = new Date(coordinateData[i].child(3).text());
      } catch (e) {
        isTimePresent = false;
      }
    }

    if (isHeightPresent) {
      try {
        height = coordinateData[i].child(1).text();
      } catch (e) {
        isHeightPresent = false;
      }
    }
    theTrackArray.push([parseFloat(coordinateX), parseFloat(coordinateY)]);
    theFullTrack.push([parseFloat(coordinateX), parseFloat(coordinateY), timeCreate, height]);

  }

  theDistance = getDistance(theTrackArray);

  if (isTimePresent || isHeightPresent) {
    fs.writeFile(path + '/full', JSON.stringify(theFullTrack), function(err) {
      if (err) throw err;
    });
  }
  fs.writeFile(path + '/track', JSON.stringify(theTrackArray), function(err) {
    if (err) throw err;
    var time = milisecToHours(theFullTrack[theFullTrack.length - 1][2] - theFullTrack[0][2]);
    if (isTimePresent) return callback(null, {
      distance: theDistance,
      time: time,
      center: theTrackArray[0]
    });
    return callback(null, {
      distance: theDistance,
      center: theTrackArray[0]
    });
  });
  /*fs.writeFile(path + '/speed', theDistance, function(err) {
    if (err) throw err;
  });*/


}

/**
 * Переводит милисекунды в h:m:s
 * @param  {Number} milliseconds
 * @return {String}
 */

function milisecToHours(milliseconds) {

  function addZero(num) {
    if (num < 10) return '0' + num;
    return num;
  }

  var seconds = ~~ (milliseconds / 1000),
    minutes = ~~ (seconds / 60),
    hours = ~~ (minutes / 60);

  seconds = Math.round(seconds % (minutes * 60));
  minutes = Math.round(minutes % (hours * 60));

  if (!isNaN(seconds)) return [hours, addZero(minutes), addZero(seconds)].join(':');
  return undefined;
}

function getDistance(array, decimals) {
  decimals = decimals || 3;
  var earthRadius = 6371; // km
  var fullDist = 0;

  for (var i = 1; i <= array.length - 2; i++) {
    lat1 = array[i][0];
    lon1 = array[i][1];
    lat2 = array[i + 1][0];
    lon2 = array[i + 1][1];

    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = earthRadius * c;
    fullDist += d;
  }
  return Math.round(fullDist * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  };
}

module.exports = parse;
