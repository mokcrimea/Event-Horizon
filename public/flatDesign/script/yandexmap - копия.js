var myMap;

// Дождёмся загрузки API и готовности DOM.
ymaps.ready(init);

function init () {
    // Создание экземпляра карты и его привязка к контейнеру с
    // заданным id ("map").
    myMap = new ymaps.Map('map', {       
        center:[44.958306, 34.109535],
        zoom:12
    });

	myMap.controls.add('zoomControl', { left: 5, top: 5 });
// ---------------------------------------------
    var placemark = new ymaps.Placemark([44.958306, 34.109735], {
            name: 'Считаем'
        }, {
            balloonContentLayout: BalloonContentLayout
        });

    map.geoObjects.add(placemark);


// --------------------------------------------- 
	var myPolyline = new ymaps.Polyline([
            // Указываем координаты вершин ломаной.
            [44.958306, 34.109735],
            [44.959306, 34.109835],
            [44.959306, 34.110000],
            [44.960, 34.11001]
        ], {
            // Описываем свойства геообъекта.
            // Содержимое балуна.
            balloonContent: "Ваш трек"
        }, {
            // Задаем опции геообъекта.
            // Отключаем кнопку закрытия балуна.
            balloonHasCloseButton:false,
            // Цвет линии.
            strokeColor: "#000000",
            // Ширина линии.
            strokeWidth: 4,
            // Коэффициент прозрачности.
            strokeOpacity: 0.5
        });
	
	myMap.geoObjects.add(myPolyline);
}

