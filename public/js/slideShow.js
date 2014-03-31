window.onload = function(){

   var arraySrcSlideList=[], //Массив адресов фотографий
       slideWidthSize, //Размер окна обозревателя фото
       mainWindowSlide = document.getElementById('slideShow'), // Главный блок обозреваля фото
       slideImagePlace = document.getElementById('slide-img'), //img Обозревателя фото
       slideLoadImg = document.getElementsByClassName('slide-load-img')[0], //Индикатор загрузки фото
       slideNextButton = document.getElementsByClassName('slide-next-btn')[0], // Кнопка "следующий слайд"
       slidePrevButton = document.getElementsByClassName('slide-prev-btn')[0], // Кнопка "предыдущий слайд"
       slideCloseButton = document.getElementsByClassName('slide-close-btn')[0], // Кнопка "закрыть"
       slideImageContent = document.getElementsByClassName('slide-img-content')[0], // Блок загрузки фото
       mainBackgroundSpace = document.getElementsByClassName('backgroundSpace')[0]; // Тёмный фон при открытии обозревателя фото


  window.addEventListener('resize', changeBckgroundSlideSize); //Фон обозревателя подстраивается под размер окна при зуммировании или изменении размера окна

  document.body.addEventListener('click', function(event) {
      if (event.target.className.search('gallery-zoom-btn') != -1) openSlideShow(event.target.parentNode);
      if ((event.target.className.search('slide-close-btn') != -1) || (event.target.className.search('backgroundSpace') != -1))
          closeSlideShow(event.target.parentNode);
      if (event.target.className.search('slide-next-btn') != -1) changePhotoSlide(true);
      if (event.target.className.search('slide-prev-btn') != -1) changePhotoSlide(false);
  }, true);


  function getClientWidth(){
    return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;
  }

  function getClientHeight(){
    return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientHeight:document.body.clientHeight;
  }


  // Функция открывает окно слайд-обозревателя
  function openSlideShow(imgContainerGallery){

    var thisImgSrc = imgContainerGallery.getElementsByTagName('img')[0].src, //Адрес фото, открытой из галереи
        mainBlockWidthSize = document.getElementsByClassName('main')[0].offsetWidth, // Получает ширину страницы
        positionScroll  = window.pageYOffset || document.documentElement.scrollTop,
        positionPhoto;

    for (var i = 0; i < inputDataObject.length; i++){ // Записываем адреса фото на странице в массив
      arraySrcSlideList[i] = inputDataObject[i].links.orig.href;
    }

    mainWindowSlide.style.display = 'block'; // Отображаем окно обозревателя фото
    slideLoadImg.style.display = 'block';
    //Центрируем обозреватель фото по высоте и ширине
    if (getClientHeight() < 730){
      mainWindowSlide.style.position = "absolute";
      mainWindowSlide.style.top = positionScroll + (getClientHeight() - 730) / 2 + 'px';
    } else {
      mainWindowSlide.style.position = "fixed";
      mainWindowSlide.style.top = (getClientHeight() - 730) / 2 + 'px';
    }

    if (mainBlockWidthSize >= 1200){
        slideWidthSize = 1100;
        mainWindowSlide.style.marginLeft = '-150px';
    } else {
        slideWidthSize = 990;
        mainWindowSlide.style.marginLeft = '-67px';
    }

    //Центрируем элементы управления обозревателя
    slideNextButton.style.marginLeft = slideWidthSize - 90 + 'px';
    slideCloseButton.style.marginLeft = slideWidthSize - 100 + 'px';
    slideImageContent.style.width = slideWidthSize + 'px';

    //Включаем задний фон обозревателя
    mainBackgroundSpace.style.display = 'block';

    //Подстраиваем задний фон обозревателя под размер экрана
    changeBckgroundSlideSize();

    mainWindowSlide.style.width = slideWidthSize + 'px';
    thisImgSrc = thisImgSrc.substring(0, thisImgSrc.length-1)+'orig';
    positionPhoto = findPosition(arraySrcSlideList, thisImgSrc);
    setPhotoToSlide(thisImgSrc, positionPhoto);

    document.addEventListener('keydown', setSlideKeyNavigate);
  }


  //Функция управления обозревателем кнопками
  function setSlideKeyNavigate(e){
    if (e.keyCode == 37) return changePhotoSlide(false);
    if (e.keyCode == 39) return changePhotoSlide(true);
    if (e.keyCode == 27) return closeSlideShow(event.target.parentNode);
  }


  //Функция закрытия слайд-обозревателя
  function closeSlideShow(){
    //Прячем окно обозревателя
    mainWindowSlide.style.display = "none";
    mainBackgroundSpace.style.display = "none";
    slideImagePlace.style.opacity = '0';
    document.removeEventListener('keydown', setSlideKeyNavigate);
  }


  // Функция открывает фотографию в слайд-обозревателе
  function setPhotoToSlide(inputPhoto, positionPhoto){
    var originalImg = new Image();

    // Сбрасываем атрибуты фото в обозревателе, и заливаем новую фото
    slideImagePlace.removeAttribute('width');
    slideImagePlace.removeAttribute('height');
    slideImagePlace.src = inputPhoto;
    originalImg.src = inputPhoto;

    //Скрываем кнопки листания на последней фотографии в списке
    slideNextButton.style.display = "block";
    slidePrevButton.style.display = "block";
    if (positionPhoto + 1 == arraySrcSlideList.length){
      slideNextButton.style.display = "none";
    }
    if (positionPhoto - 1 == -1){
      slidePrevButton.style.display = "none";
    }

    //В зависимости от разрешения фото - подгоняем её под окно обозревателя
    originalImg.onload = function(){
      var originalHeight = originalImg.height,
          originalWidth = originalImg.width,
          differentSize;

      if ((originalHeight > 730) || (originalWidth > slideWidthSize)){

        if (originalHeight > originalWidth){
          slideImagePlace.setAttribute('height', '730px');
        }

        if (originalWidth > originalHeight){
          differentSize = slideWidthSize * originalHeight / originalWidth;
          if (differentSize > 730){
            slideImagePlace.setAttribute('height', '730px');
          } else{
            slideImagePlace.setAttribute('width', slideWidthSize + 'px');
          }
        }
      }
      slideLoadImg.style.display = "none";
      slideImagePlace.style.opacity = "1";
      return;
    }
  }


  //функция определения позиции в массиве текущей отображённой фото
  function findPosition(array, value) {
    for(var i = 0; i < array.length; i++) {
      if (array[i] == value) return i;
    }
    return -1;
  }


  // Функция определяет следующую необходимую фотографию
  function changePhotoSlide(bool){

    positionPhoto = findPosition(arraySrcSlideList, slideImagePlace.src);
    if (bool){
      if (positionPhoto != arraySrcSlideList.length - 1){
        slideImagePlace.style.opacity = '0';
        slideLoadImg.style.display = 'block';
        setPhotoToSlide(arraySrcSlideList[positionPhoto + 1], positionPhoto + 1);
      }
    } else {
      if (positionPhoto != 0){
        slideImagePlace.style.opacity = '0';
        slideLoadImg.style.display = 'block';
        setPhotoToSlide(arraySrcSlideList[positionPhoto - 1], positionPhoto - 1);
      }
    }
  }


  // Функция подстройки зайднего фона при режиме обозревателя фото
  function changeBckgroundSlideSize(){
    mainBackgroundSpace.style.width = getClientWidth() + 'px';
    mainBackgroundSpace.style.height = getClientHeight() + 'px';
  }

}