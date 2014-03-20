var setAlertMessage = function(message, elem){

  var turnAlertMessage = function(){  
    var alertList = document.body.getElementsByClassName('alert-message');
    for(var i = 0; i < alertList.length; i++) alertList[i].style.opacity = '0';
    document.body.removeEventListener('click', turnAlertMessage);
  }

  var thisElem = document.body.getElementsByClassName('form-group')[elem];
  thisElem.innerHTML = '<div class="alert-message">' + message + '</div>';

  setTimeout(function(){
    var alertList = document.body.getElementsByClassName('alert-message');
    for(var i = 0; i < alertList.length; i++) alertList[i].style.opacity = '1';

    document.body.addEventListener('click', turnAlertMessage);

  }, 10);
}

setAlertMessage('Проверка', 4);
setAlertMessage('Проверка 2 3 1 тест ', 3);