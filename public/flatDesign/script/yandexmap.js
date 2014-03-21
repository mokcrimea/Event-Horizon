var myMap;

ymaps.ready(init);

function init () {
    myMap = new ymaps.Map('map', {       
        center:[44.958306, 34.109535],
        zoom:12
    });

    var MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
    '<div class="balyn-style"><img class="balun-img" src="img/photo1.jpg" width="480"></div>' 
        );

    var setPhoto = function(text, coord){
        var data = {
            balloonContent: text,
            hintContent: 'Метка',
            iconContent: '1'
        },
        options = {balloonHasCloseButton: true,
                   balloonContentLayout: MyBalloonContentLayoutClass},
        myPlacemark = new ymaps.Placemark(coord, data, options);

        myMap.geoObjects.add(myPlacemark);
    }

    setPhoto('Hello', [44.958306, 34.109535]);
}   


