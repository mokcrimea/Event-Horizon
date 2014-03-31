function setAlertMessage(message){

  var alertWindow = document.getElementsByClassName('alert-message')[0];

  alertWindow.innerHTML = message;
  alertWindow.style.opacity = '1';

  document.addEventListener('click', turnAlertMessage);

  function turnAlertMessage(){  
    alertWindow.style.opacity = '0';
    document.body.removeEventListener('click', turnAlertMessage);
  }
}