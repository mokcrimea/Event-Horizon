var heightHeader = 70; //Высота Header

function changePositionMenu() {
  var positionScroll  = window.pageYOffset || document.documentElement.scrollTop,
      menuElem = document.getElementsByClassName('leftMenuContainer')[0];

  if(typeof menuElem != "undefined" && menuElem){
    if (positionScroll < heightHeader) {
      menuElem.style.top = 0 + "px";
    } else {
      menuElem.style.top = positionScroll - heightHeader + "px";
    }
  }
}

window.addEventListener("scroll", changePositionMenu, false);