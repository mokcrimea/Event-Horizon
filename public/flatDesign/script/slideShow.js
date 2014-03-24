document.body.addEventListener('click', function(event) {
    if (event.target.className.search('gallery-zoom-btn') != -1) openSlideShow(event.target.parentNode);
    if (event.target.className.search('slide-close-btn') != -1) closeSlideShow(event.target.parentNode);
}, true);




function openSlideShow(imgContainerGallery){

  function getClientWidth(){
    return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;
  }
 
  function getClientHeight(){
    return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientHeight:document.body.clientHeight;
  }

  var mainWindowSlide = document.getElementById('slideShow'),
      backgroundBlock = document.getElementsByClassName('backgroundSpace')[0],
      thisImgSrc = imgContainerGallery.childNodes[5].childNodes[1].src,
      slideImg = mainWindowSlide.childNodes[3].childNodes[0],
      originalImg = new Image();
      
  mainWindowSlide.style.display = 'block';

  if (getClientHeight() > 750) mainWindowSlide.style.top = (getClientHeight() - 750) / 2 + 'px';

  backgroundBlock.style.display = 'block';
  backgroundBlock.style.width = getClientWidth() + 'px';
  backgroundBlock.style.height = getClientHeight() + 'px';

  slideImg.removeAttribute('width');
  slideImg.removeAttribute('height');
  slideImg.src = thisImgSrc;
  originalImg.src = thisImgSrc;
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
        }
      }
      
    }
    slideImg.style.opacity = "1";
    return;
  }
  
}





function closeSlideShow(slideShowWindow){
  slideShowWindow.style.display = "none";
  slideShowWindow.childNodes[3].firstChild.style.opacity = "0";
  document.getElementsByClassName('backgroundSpace')[0].style.display = "none";
}
