var myMap,
    arrayInputDataCoordImg = [[[44.958306,34.109535], 'photo1.jpg'],
                              [[44.962786,34.084746], 'photo2.jpg'],
                              [[44.934436,34.087868], 'photo3.jpg'],
                              [[44.931022,34.134216], 'photo4.jpg']];

ymaps.ready(init);


function init () {
    myMap = new ymaps.Map('map', {       
        center:[44.958306, 34.109535],
        zoom:12
    });

    var originalImg = new Image(), pictureWidth, pictureHeight;

    function setPhoto(coord, urlPicture,pictureWidth){
        var myPlacemark = new ymaps.Placemark(coord, {
                balloonContentBody: 
                    "<img class='balloon-img' src='"+urlPicture+"' width='"+pictureWidth+"'/>" +
                    "<div class='balloon-fullsize' onclick='ballonImageZoom()'>Увеличить фотографию</div>",
                hintContent: "Показать фотографию",
            }, {
                iconImageHref: urlPicture,
                iconImageSize: [25, 20],
                iconImageOffset: [0, 0]
            });

        myMap.geoObjects.add(myPlacemark);
    };

    function determineImgBalloonSize(i){
        originalImg.src = arrayInputDataCoordImg[i][1];
        originalImg.onload = function(){
            pictureWidth = 480;
            pictureHeight = 480 * originalImg.height / originalImg.width;
            if (pictureHeight > 400){
                pictureWidth = pictureWidth - ((pictureHeight - 400) * pictureWidth / pictureHeight);
            }
            setPhoto(arrayInputDataCoordImg[i][0], arrayInputDataCoordImg[i][1], pictureWidth);
            if (i < arrayInputDataCoordImg.length) determineImgBalloonSize(i+1);   
        }
    };

    determineImgBalloonSize(0); 
};



function ballonImageZoom(){
    function getClientHeight(){
        return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientHeight:document.body.clientHeight;
    }

    function getClientWidth(){
        return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;
    }

    var imgBalloon = document.getElementsByClassName('balloon-img')[0],
        imgSrc = document.getElementById('zoom-balloon-image'),
        originalImg = new Image(),
        differentSize;

    imgSrc.src = imgBalloon.src;
    imgSrc.style.display = "block";
    imgSrc.removeAttribute('width');
    imgSrc.removeAttribute('height');
    originalImg.src = imgSrc.src;

    originalImg.onload = function(){
        var originalHeight = currentHeight = originalImg.height,
            originalWidth = currentWidth = originalImg.width;

        if ((originalHeight > 750) || (originalWidth > 1100)){

            if (originalHeight > originalWidth){
                currentWidth = 750 * originalWidth / originalHeight;
                currentHeight = 750;          
                imgSrc.setAttribute('height', '750px');
            }

            if (originalWidth > originalHeight){
                differentSize = 1100 * originalHeight / originalWidth;

                if (differentSize > 750){
                    currentWidth = 750 * originalWidth / originalHeight;
                    currentHeight = 750;
                    imgSrc.setAttribute('height', '750px');
                } else{
                    currentHeight = 1100 * originalHeight / originalWidth;
                    currentWidth = 1100;
                    imgSrc.setAttribute('width', '1100px');
                }
            }
        }

        imgSrc.style.top =((getClientHeight() - currentHeight) / 2) + 'px';
        imgSrc.style.left = ((getClientWidth() - currentWidth) / 2) + 'px';

        setTimeout(function(){
            imgSrc.style.opacity = "1";
        }, 10);
        imgSrc.addEventListener('click', turnBallonImage);
    }
}

function turnBallonImage(){  
    var imgSrc = document.getElementById('zoom-balloon-image');
    imgSrc.style.opacity = "0";
    imgSrc.style.top = '0';

    setTimeout(function(){
         imgSrc.style.display = "none";
    }, 700);
   
    document.body.removeEventListener('click', turnBallonImage);
  }