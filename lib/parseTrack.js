var libxmljs = require("libxmljs");
var fs = require('fs');

function parse(Data, path, callback) {
  var theTrackArray = [],
    theFullTrack = [];
  var gpxInXml = Data.toString(),
    positionOfGpxTag = gpxInXml.indexOf('<metadata>');
  //Удаляем из файла неиспользуемые параметры из-за которых крешится парсер.
  gpxInXml = '<?xml version="1.0" encoding="utf-8"?>\n<gpx>\n' + gpxInXml.substr(positionOfGpxTag);

  var xmlDoc = libxmljs.parseXml(gpxInXml),
    coordinateData = xmlDoc.child(3).child(1).childNodes(),
    coordinateX, coordinateY, timeCreate, timeFormated;
  var theDistance = [];

  for (var i = 1; i < coordinateData.length; i += 8) {
    coordinateX = coordinateData[i].attr('lat').value();
    coordinateY = coordinateData[i].attr('lon').value();
    timeCreate = new Date(coordinateData[i].child(3).text());
    theTrackArray.push([parseFloat(coordinateX), parseFloat(coordinateY)]);
    theFullTrack.push([timeCreate, parseFloat(coordinateX), parseFloat(coordinateY)]);
  }

  var shag = Math.round(theFullTrack.length / 2000);

  for (var i = 1; i < theFullTrack.length - 1; i += shag) {
    theDistance.push(distance(
      theFullTrack[i][1],
      theFullTrack[i][2],
      theFullTrack[i + 1][1],
      theFullTrack[i + 1][2],
      theFullTrack[i][0],
      theFullTrack[i + 1][0]
    ));
  }

  fs.writeFile(path + '/track', JSON.stringify(theTrackArray), function(err) {
    if (err) throw err;
  });
  fs.writeFile(path + '/full', JSON.stringify(theFullTrack), function(err) {
    if (err) throw err;
    callback(null);
  });
  /*fs.writeFile(path + '/speed', theDistance, function(err) {
    if (err) throw err;
  });*/


}

function toCSV(key, value) {
  console.log('key: ' + key);
  console.log('value: ' + value);
  return value[0] + ',' + value[1];
}

/**
 * Определяет расстояния между точками и скорости перемещения между ними
 * @param  {Number} lat1  Координата X первой точки
 * @param  {Number} long1 Координата Y первой точки
 * @param  {Number} lat2  Координата X второй точки
 * @param  {Number} long2 Координата X второй точки
 * @param  {Number} time1 Время фиксирования координат 1 точки
 * @param  {Number} time2 Время фиксирования координат 2 точки
 * @return {String}       скорость, расстояние
 */

function distance(lat1, long1, lat2, long2, time1, time2) {
  // Полярный радиус земли в метрах
  var R = 6356800;

  lat1 *= Math.PI / 180;
  lat2 *= Math.PI / 180;
  long1 *= Math.PI / 180;
  long2 *= Math.PI / 180;

  //вычисление косинусов и синусов широт и разницы долгот
  var cl1 = Math.cos(lat1);
  var cl2 = Math.cos(lat2);
  var sl1 = Math.sin(lat1);
  var sl2 = Math.sin(lat2);
  var delta = long2 - long1;
  var cdelta = Math.cos(delta);
  var sdelta = Math.sin(delta);

  //вычисления длины большого круга
  var y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
  var x = sl1 * sl2 + cl1 * cl2 * cdelta;
  var ad = Math.atan2(y, x);

  //расстояние между двумя координатами в метрах
  var dist = ad * R;
  // Найдем скорость между двумя координатами в метрах
  var speed = dist / ((time2.getTime() - time1.getTime()) * 1000);
  return speed + ',' + dist;
}


module.exports = parse;
