var myMap;
ymaps.ready(init);


function init() {
  myMap = new ymaps.Map('map', {
    center: center,
    zoom: 11,
    behaviors: ['default', 'scrollZoom']
  });

  myMap.controls.add('smallZoomControl', {
    left: 3,
    top: 5
  });
  myMap.controls.add(new ymaps.control.TypeSelector(['yandex#map', 'yandex#publicMap', 'yandex#publicMap', 'yandex#satellite', 'yandex#hybrid']));
  // myMap.controls.add('miniMap');

  var originalImg = new Image(),
    pictureWidth, pictureHeight,
    myGeoObjects = [],
    myClusterer = new ymaps.Clusterer();


  function setPhoto(i, coord, urlPicture, pictureWidth) {
    myGeoObjects[i] = new ymaps.GeoObject({
      geometry: {
        type: 'Point',
        coordinates: coord
      },
      properties: {
        clusterCaption: arrayInputDataCoordImg[i][2],
        balloonContentBody: "<img class='balloon-img' onclick='ballonImageZoom()' src='" + urlPicture + "' width='" + pictureWidth + "'/>"
      }
    });
    myClusterer.add(myGeoObjects[i]);
  }


  function determineImgBalloonSize(i) {
    try {
      originalImg.src = arrayInputDataCoordImg[i][1];
    } catch (e) {}
    originalImg.onload = function() {
      // Ширина картинки под размер кластера
      pictureWidth = 340;
      pictureHeight = 340 * originalImg.height / originalImg.width;
      if (pictureHeight > 195) {
        pictureWidth = pictureWidth - ((pictureHeight - 195) * pictureWidth / pictureHeight);
      }
      setPhoto(i, arrayInputDataCoordImg[i][0], arrayInputDataCoordImg[i][1], pictureWidth);
      if (i < arrayInputDataCoordImg.length) determineImgBalloonSize(i + 1);
    };
  }

  determineImgBalloonSize(0);
  myMap.geoObjects.add(myClusterer);


  var myPolyline = new ymaps.Polyline(coord, {
    // Описываем свойства геообъекта.
    // Содержимое балуна.
    balloonContent: 'Протяженность маршрута: ' + distance + ' км.'
  }, {
    // Задаем опции геообъекта.
    // Цвет линии.
    strokeColor: "#f4a",
    // Ширина линии.
    strokeWidth: 4,
    // Коэффициент прозрачности.
    strokeOpacity: 0.8
  });

  myMap.geoObjects.add(myPolyline);
}


function ballonImageZoom() {
  function getClientHeight() {
    return document.compatMode == 'CSS1Compat' && !window.opera ? document.documentElement.clientHeight : document.body.clientHeight;
  }

  function getClientWidth() {
    return document.compatMode == 'CSS1Compat' && !window.opera ? document.documentElement.clientWidth : document.body.clientWidth;
  }

  var imgBalloon = document.getElementsByClassName('balloon-img')[0],
    imgSrc = document.getElementById('zoom-balloon-image'),
    originalImg = new Image(),
    differentSize;

  imgSrc.src = imgBalloon.src.substring(0, imgBalloon.src.length - 1) + 'orig';
  imgSrc.style.display = "block";
  imgSrc.removeAttribute('width');
  imgSrc.removeAttribute('height');
  originalImg.src = imgSrc.src;

  // Функция открывания увеличенного экземляра фотографии
  originalImg.onload = function() {
    var originalHeight = currentHeight = originalImg.height,
      originalWidth = currentWidth = originalImg.width;

    if ((originalHeight > 750) || (originalWidth > 1000)) {

      if (originalHeight > originalWidth) {
        currentWidth = 750 * originalWidth / originalHeight;
        currentHeight = 750;
        imgSrc.setAttribute('height', '750px');
      }

      if (originalWidth > originalHeight) {
        differentSize = 1000 * originalHeight / originalWidth;

        if (differentSize > 750) {
          currentWidth = 750 * originalWidth / originalHeight;
          currentHeight = 750;
          imgSrc.setAttribute('height', '750px');
        } else {
          currentHeight = 1000 * originalHeight / originalWidth;
          currentWidth = 1000;
          imgSrc.setAttribute('width', '1000px');
        }
      }
    }

    imgSrc.style.top = ((getClientHeight() - currentHeight) / 2) + 'px';
    imgSrc.style.left = ((getClientWidth() - currentWidth) / 2) + 'px';

    setTimeout(function() {
      imgSrc.style.opacity = "1";
    }, 10);
    imgSrc.addEventListener('click', turnBallonImage);
  };
}

// Закрывает увеличенное изображение фотографии
function turnBallonImage() {
  var imgSrc = document.getElementById('zoom-balloon-image');
  imgSrc.style.opacity = "0";
  imgSrc.style.top = '0';

  setTimeout(function() {
    imgSrc.style.display = "none";
  }, 700);

  document.body.removeEventListener('click', turnBallonImage);
}
