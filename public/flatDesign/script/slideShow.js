document.body.addEventListener('click', function(event) {
    if (event.target.className.search('gallery-zoom-btn') != -1) openSlideShow(event.target.parentNode);
    if (event.target.className.search('slide-close-btn') != -1) closeSlideShow(event.target.parentNode);
    if (event.target.className.search('slide-next-btn') != -1) showNextPhoto();
    if (event.target.className.search('slide-prev-btn') != -1) showPrevPhoto();
}, true);

var arraySrcList=[],
    inputDataObject = [{"links":{"XXS":{"width":75,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_XXS","height":75},"XL":{"width":800,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_XL","height":450},"M":{"width":300,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_M","height":169},"L":{"width":500,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_L","height":281},"XXXS":{"width":50,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_XXXS","height":50},"XXXL":{"width":1280,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_XXXL","height":720},"S":{"width":150,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_S","height":84},"XS":{"width":100,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_XS","height":56},"XXL":{"width":1024,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_XXL","height":576},"orig":{"width":1920,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6d_a01a0758_orig","bytesize":293390,"height":1080}},"self":"http://api-fotki.yandex.ru/api/users/maestrocrimea/photo/842861/","param":"urn:yandex:fotki:maestrocrimea:photo:842861","_id":"53308122f330b2400706e269","coordinates":[]},{"links":{"XXS":{"width":75,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_XXS","height":75},"XL":{"width":800,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_XL","height":450},"M":{"width":300,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_M","height":169},"L":{"width":500,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_L","height":281},"XXXS":{"width":50,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_XXXS","height":50},"XXXL":{"width":1280,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_XXXL","height":720},"S":{"width":150,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_S","height":84},"XS":{"width":100,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_XS","height":56},"XXL":{"width":1024,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_XXL","height":576},"orig":{"width":1920,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6f_c1da5ddf_orig","bytesize":0,"height":1080}},"self":"http://api-fotki.yandex.ru/api/users/maestrocrimea/photo/842863/","param":"urn:yandex:fotki:maestrocrimea:photo:842863","_id":"53308124f330b2400706e26a","coordinates":[]},{"links":{"XXS":{"width":75,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_XXS","height":75},"XL":{"width":800,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_XL","height":450},"M":{"width":300,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_M","height":169},"L":{"width":500,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_L","height":281},"XXXS":{"width":50,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_XXXS","height":50},"XXXL":{"width":1280,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_XXXL","height":720},"S":{"width":150,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_S","height":84},"XS":{"width":100,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_XS","height":56},"XXL":{"width":1024,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_XXL","height":576},"orig":{"width":1920,"href":"http://img-fotki.yandex.ru/get/9827/231475615.0/0_cdc6e_9857be8c_orig","bytesize":0,"height":1080}},"self":"http://api-fotki.yandex.ru/api/users/maestrocrimea/photo/842862/","param":"urn:yandex:fotki:maestrocrimea:photo:842862","_id":"53308124f330b2400706e26b","coordinates":[]}];;

// Функция открывает окно слайд-обозревателя
function openSlideShow(imgContainerGallery){

  function getClientWidth(){
    return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;
  }
 
  function getClientHeight(){
    return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientHeight:document.body.clientHeight;
  }

  var mainWindowSlide = document.getElementById('slideShow'),
      backgroundBlock = document.getElementsByClassName('backgroundSpace')[0],
      thisImgSrc = imgContainerGallery.childNodes[5].childNodes[1].src;

  for (var i = 0; i < inputDataObject.length; i++){
    arraySrcList[i] = inputDataObject[i].links.orig.href;
  }

  mainWindowSlide.style.display = 'block';

  if (getClientHeight() > 750) mainWindowSlide.style.top = (getClientHeight() - 750) / 2 + 'px';

  backgroundBlock.style.display = 'block';
  backgroundBlock.style.width = getClientWidth() + 'px';
  backgroundBlock.style.height = getClientHeight() + 'px';

  setPhotoToSlide(thisImgSrc);
}

// Функция закрытия слайд-обозревателя
function closeSlideShow(slideShowWindow){
  slideShowWindow.style.display = "none";
  document.getElementById('slide-img').style.opacity = "0";
  document.getElementsByClassName('backgroundSpace')[0].style.display = "none";
}

// Функция открывает фотографию в слайд-обозревателе
function setPhotoToSlide(inputPhoto){

  var slideImg = document.getElementById('slide-img'),
      originalImg = new Image();

  slideImg.removeAttribute('width');
  slideImg.removeAttribute('height');
  slideImg.src = inputPhoto;
  originalImg.src = inputPhoto;

  originalImg.onload = function(){
    var originalHeight = originalImg.height,
        originalWidth = originalImg.width,
        differentSize;

    if ((originalHeight > 750) || (originalWidth > 1100)){

      if (originalHeight > originalWidth){
        slideImg.setAttribute('height', '750px');
      }

      if (originalWidth > originalHeight){
        differentSize = 1100 * originalHeight / originalWidth;
        if (differentSize > 750){
          slideImg.setAttribute('height', '750px');
        } else{
          slideImg.setAttribute('width', '1100px');
        }
      }

    }
    slideImg.style.opacity = "1";
    return;
  }
}

// Функция перелистывания фото вперёд
function showNextPhoto(){
  changePhotoSlide(true);
}

// Функция перелистывания фото назад
function showPrevPhoto(){
  changePhotoSlide(false);
}

// Функция определяет следующую необходимую фотографию
function changePhotoSlide(bool){
  var nowImg = document.getElementById('slide-img'),
      positionPhoto;

  nowImg.style.opacity = '0';

  positionPhoto = arraySrcList.indexOf(nowImg.src);
  if (bool){
    if (positionPhoto != arraySrcList.length - 1){
      setPhotoToSlide(arraySrcList[positionPhoto + 1]);
    }
  } else {
    if (positionPhoto != 0){
      setPhotoToSlide(arraySrcList[positionPhoto - 1]);
    }
  }
}