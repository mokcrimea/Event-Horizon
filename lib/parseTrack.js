var libxmljs = require("libxmljs");
var fs = require('fs');

function parse(Data, path, callback) {

  var theTrackArray = [],
    theTimeArray = [],
    gpxInXml = Data.toString(),
    positionOfGpxTag = gpxInXml.indexOf('<trk>'),
    isTimePresent = true,
    isHeightPresent = true,
    xmlDoc;

  //Удаляем из файла неиспользуемые параметры из-за которых крешится парсер.
  gpxInXml = '<?xml version="1.0" encoding="utf-8"?>\n<gpx>\n' + gpxInXml.substr(positionOfGpxTag);

  try {
    xmlDoc = libxmljs.parseXml(gpxInXml);
  } catch (err) {
    return callback(err);
  }

  var coordinateData = xmlDoc.get('//trkseg').childNodes(),
    coordinateX, coordinateY, timeCreate, height, theDistance;
  for (var i = 1; i < coordinateData.length; i += 4) {

    coordinateX = coordinateData[i].attr('lat').value();
    coordinateY = coordinateData[i].attr('lon').value();
    if (isTimePresent) {
      try {
        timeCreate = new Date(coordinateData[i].child(3).text());
      } catch (e) {
        isTimePresent = false;
      }
    }
    theTimeArray.push(timeCreate);
    theTrackArray.push([parseFloat(coordinateX), parseFloat(coordinateY)]);
  }

  theDistance = getDistance(theTrackArray);


  fs.writeFile(path + '/full', JSON.stringify(gpxInXml), function(err) {
    if (err) throw err;
  });

  fs.writeFile(path + '/track', JSON.stringify(theTrackArray), function(err) {
    var time;
    if (err) throw err;
    try {
      time = milisecToHours(theTimeArray[theTimeArray.length - 1] - theTimeArray[0]);
    } catch (e) {
      isTimePresent = false;
    }
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

  if (minutes !== 0) {
    seconds = Math.round(seconds % (minutes * 60));
    minutes = Math.round(minutes % (hours * 60));
  }
  if (seconds === 0 && hours === 0 && minutes === 0) {
    return milliseconds + ' мс';
  }
  return [hours, addZero(minutes), addZero(seconds)].join(':') + ' ч';
}

function getDistance(array, decimals) {
  decimals = decimals || 3;
  var earthRadius = 6371; // km
  var fullDist = 0;

  for (var i = 0; i < array.length - 1; i++) {
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
