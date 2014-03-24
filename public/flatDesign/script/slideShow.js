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
      slideImg = mainWindowSlide.childNodes[3].childNodes[0];
      
  mainWindowSlide.style.display = 'block';

  if (getClientHeight() > 750) mainWindowSlide.style.top = (getClientHeight() - 750) / 2 + 'px';

  backgroundBlock.style.display = 'block';
  backgroundBlock.style.width = getClientWidth() + 'px';
  backgroundBlock.style.height = getClientHeight() + 'px';

  slideImg.src = thisImgSrc;
  slideImg.setAttribute('width', '1000px');
}

function closeSlideShow(slideShowWindow){
  slideShowWindow.style.display = "none";
  document.getElementsByClassName('backgroundSpace')[0].style.display = "none";
}
