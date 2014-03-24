var myMap,
    testArray = [
                [[44.958306,34.109535], 'photo1.jpg'],
                [[44.962786,34.084746], 'photo3.jpg'],
                [[44.934436,34.087868], 'photo1.jpg'],
                [[44.931022,34.134216], 'photo3.jpg']];

ymaps.ready(init);


function init () {
    myMap = new ymaps.Map('map', {       
        center:[44.958306, 34.109535],
        zoom:12
    });

    var setPhoto = function(coord, urlPicture){
        var myPlacemark = new ymaps.Placemark(coord, {
                balloonContentBody: 
                "<img class='balloon-img' src='"+urlPicture+"' width='480'/>" +
                "<div class='balloon-fullsize' onclick='ballonImageZoom()'>Увеличить фототграфию</div>",
                hintContent: "Показать фотографию",
            }, {
                iconImageHref: urlPicture,
                iconImageSize: [25, 20],
                iconImageOffset: [0, 0]
            });

        myMap.geoObjects.add(myPlacemark);
        };

    for (var i = 0; i < testArray.length; i++){
        setPhoto(testArray[i][0], testArray[i][1]);
    }
};



var ballonImageZoom = function(){
    var imgBalloon = document.getElementsByClassName('balloon-img')[0],
        imgBalloonSrc = imgBalloon.getAttribute('src'),
        imgSrc = document.getElementById('zoom-balloon-image');
        
    imgSrc.setAttribute('src', imgBalloonSrc);
    imgSrc.style.display = "block";

    setTimeout(function(){
        imgSrc.style.opacity = "1";
    }, 10);
    imgSrc.addEventListener('click', turnBallonImage);
}

var turnBallonImage = function(){  
    var imgSrc = document.getElementById('zoom-balloon-image');
    imgSrc.style.opacity = "0";

    setTimeout(function(){
         imgSrc.style.display = "none";
    }, 700);
   
    document.body.removeEventListener('click', turnBallonImage);
  }