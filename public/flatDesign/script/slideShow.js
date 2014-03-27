window.addEventListener('resize', changeBckgroundSlideSize); //Чёрный фон при открытии обозревателя фото. 
// Подстраивается под размер окна при зуммировании или изменении размера окна 

document.body.addEventListener('click', function(event) {
    if (event.target.className.search('gallery-zoom-btn') != -1) openSlideShow(event.target.parentNode);
    if ((event.target.className.search('slide-close-btn') != -1) || (event.target.className.search('backgroundSpace') != -1))
      closeSlideShow(event.target.parentNode);
    if (event.target.className.search('slide-next-btn') != -1) changePhotoSlide(true);
    if (event.target.className.search('slide-prev-btn') != -1) changePhotoSlide(false);
}, true);

var arraySrcSlideList=[], //Массив адресов фотографий
    slideWidthSize,
    inputDataObject = [{"links":{"XXS":{"width":75,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_XXS","height":75},"XL":{"width":800,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_XL","height":450},"M":{"width":300,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_M","height":169},"L":{"width":500,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_L","height":281},"XXXS":{"width":50,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_XXXS","height":50},"XXXL":{"width":1280,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_XXXL","height":720},"S":{"width":150,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_S","height":84},"XS":{"width":100,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_XS","height":56},"XXL":{"width":1024,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_XXL","height":576},"orig":{"width":1920,"href":"file:///D:/temp/setPicture/public/flatDesign/img/photo8.jpg","bytesize":293390,"height":1080}},"self":"http://api-fotki.yandex.ru/api/users/maestrocrimea/photo/842861/","param":"urn:yandex:fotki:maestrocrimea:photo:842861","_id":"53308122f330b2400706e269","coordinates":[]},{"links":{"XXS":{"width":75,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_XXS","height":75},"XL":{"width":800,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_XL","height":450},"M":{"width":300,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_M","height":169},"L":{"width":500,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_L","height":281},"XXXS":{"width":50,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_XXXS","height":50},"XXXL":{"width":1280,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_XXXL","height":720},"S":{"width":150,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_S","height":84},"XS":{"width":100,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_XS","height":56},"XXL":{"width":1024,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_XXL","height":576},"orig":{"width":1920,"href":"file:///D:/temp/setPicture/public/flatDesign/img/photo7.jpg","bytesize":0,"height":1080}},"self":"http://api-fotki.yandex.ru/api/users/maestrocrimea/photo/842863/","param":"urn:yandex:fotki:maestrocrimea:photo:842863","_id":"53308124f330b2400706e26a","coordinates":[]},{"links":{"XXS":{"width":75,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_XXS","height":75},"XL":{"width":800,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_XL","height":450},"M":{"width":300,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_M","height":169},"L":{"width":500,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_L","height":281},"XXXS":{"width":50,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_XXXS","height":50},"XXXL":{"width":1280,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_XXXL","height":720},"S":{"width":150,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_S","height":84},"XS":{"width":100,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_XS","height":56},"XXL":{"width":1024,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_XXL","height":576},"orig":{"width":1920,"href":"file:///D:/temp/setPicture/public/flatDesign/img/photo9.jpg","bytesize":0,"height":1080}},"self":"http://api-fotki.yandex.ru/api/users/maestrocrimea/photo/842862/","param":"urn:yandex:fotki:maestrocrimea:photo:842862","_id":"53308124f330b2400706e26b","coordinates":[]}];


// Функция открывает окно слайд-обозревателя
function openSlideShow(imgContainerGallery){
 
  function getClientHeight(){ // Получает размер она пользователя
    return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientHeight:document.body.clientHeight;
  }

  var mainWindowSlide = document.getElementById('slideShow'), // Главный элемент обозреваля фото
      thisImgSrc = imgContainerGallery.getElementsByTagName('img')[0].src, //Адрес фото, открытой из галереи
      mainBlockWidthSize = document.getElementsByClassName('main')[0].offsetWidth;

  for (var i = 0; i < inputDataObject.length; i++){ // Записываем адреса фото на странице в массив
    arraySrcSlideList[i] = inputDataObject[i].links.orig.href;
  }

  mainWindowSlide.style.display = 'block';

  //Центрируем обозреватель фото по высоте и ширине
  if (getClientHeight() > 730) mainWindowSlide.style.top = (getClientHeight() - 730) / 2 + 'px';
  if (mainBlockWidthSize >= 1200){
      slideWidthSize = 1100;
      mainWindowSlide.style.marginLeft = '-150px';
  } else {
      slideWidthSize = 990;
      mainWindowSlide.style.marginLeft = '-67px';
  }

  document.getElementsByClassName('slide-next-btn')[0].style.marginLeft = slideWidthSize - 90 + 'px';
  document.getElementsByClassName('slide-close-btn')[0].style.marginLeft = slideWidthSize - 100 + 'px';
  document.getElementsByClassName('slide-img-content')[0].style.width = slideWidthSize + 'px';

  document.getElementsByClassName('backgroundSpace')[0].style.display = 'block';

  changeBckgroundSlideSize();
  thisImgSrc = thisImgSrc.substring(0, thisImgSrc.length-1)+'orig';
  setPhotoToSlide(thisImgSrc);

  document.addEventListener('keydown', setSlideKeyNavigate);
}


function setSlideKeyNavigate(e){
  if (e.keyCode == 37) return changePhotoSlide(false);
  if (e.keyCode == 39) return changePhotoSlide(true);
  if (e.keyCode == 27) return closeSlideShow(event.target.parentNode);
}


// Функция закрытия слайд-обозревателя
function closeSlideShow(){
  document.getElementById('slideShow').style.display = "none";
  document.getElementsByClassName('backgroundSpace')[0].style.display = "none";
  document.getElementById('slide-img').style.opacity = '0';
  document.removeEventListener('keydown', setSlideKeyNavigate);
}


// Функция открывает фотографию в слайд-обозревателе
function setPhotoToSlide(inputPhoto){

  var slideImg = document.getElementById('slide-img'),
      originalImg = new Image();

  document.getElementById('slideShow').style.width = slideWidthSize + 'px';
  slideImg.removeAttribute('width');
  slideImg.removeAttribute('height');
  slideImg.src = inputPhoto;
  originalImg.src = inputPhoto;

  originalImg.onload = function(){
    var originalHeight = originalImg.height,
        originalWidth = originalImg.width,
        differentSize;

    if ((originalHeight > 730) || (originalWidth > slideWidthSize)){

      if (originalHeight > originalWidth){
        slideImg.setAttribute('height', '730px');
      }

      if (originalWidth > originalHeight){
        differentSize = slideWidthSize * originalHeight / originalWidth;
        if (differentSize > 730){
          slideImg.setAttribute('height', '730px');
        } else{
          slideImg.setAttribute('width', slideWidthSize + 'px');
        }
      }
    }
    document.getElementsByClassName('slide-load-img')[0].style.display = "none";
    slideImg.style.opacity = "1";

    return;
  }
}


// Функция определяет следующую необходимую фотографию
function changePhotoSlide(bool){
  var nowImg = document.getElementById('slide-img'),
      loadIndicator = document.getElementsByClassName('slide-load-img')[0],
      positionPhoto;

  function find(array, value) {
    for(var i = 0; i < array.length; i++) {
      if (array[i] == value) return i;
    }
    return -1;
  }

  positionPhoto = find(arraySrcSlideList, nowImg.src);
  if (bool){
    if (positionPhoto != arraySrcSlideList.length - 1){
      nowImg.style.opacity = '0';
      loadIndicator.style.display = 'block';
      setPhotoToSlide(arraySrcSlideList[positionPhoto + 1]);
    }
  } else {
    if (positionPhoto != 0){
      nowImg.style.opacity = '0';
      loadIndicator.style.display = 'block';
      setPhotoToSlide(arraySrcSlideList[positionPhoto - 1]);
    }
  }
}


// Функция подстройки зайднего фона при режиме обозревателя фото
function changeBckgroundSlideSize(){
  function getClientWidth(){
    return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;
  }
 
  function getClientHeight(){
    return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientHeight:document.body.clientHeight;
  }

  var  backgroundBlock = document.getElementsByClassName('backgroundSpace')[0];

  backgroundBlock.style.width = getClientWidth() + 'px';
  backgroundBlock.style.height = getClientHeight() + 'px';
}