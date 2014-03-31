window.onload = function(){
  var reTitle = /(^[A-zА-я0-9\s-.,_еЁ]{3,55}$)/,
      inputForm = document.getElementsByClassName('form-input-load-text')[0],
      loadIndicator = document.getElementsByClassName('load-file-indicator')[0],
      alertWindow = document.getElementsByClassName('alert-message')[0],
      re = new RegExp(),
      form = document.upload_track,
      validExtensions = [".gpx"],
      arrayOfFiles = form.upload;

  // Отслеживает некорректно введённое название файла в момент ввода
  document.addEventListener("keyup", function(){
    if (!reTitle.test(inputForm.value)) {
      alertWindow.innerHTML = 'Недопустимое имя';
      alertWindow.style.opacity = '1';
    } else{
      alertWindow.style.opacity = '0';
    }
  });

  // Выводит окно ошибки, если при нажатии кнопки "загрузить" - в поле некорректное имя файла или расширение
  document.getElementsByClassName('list-information-gallery')[0].addEventListener("click", function(e){
    if (!reTitle.test(form.title.value)) {
      alertWindow.innerHTML = 'Недопустимое имя файла!';
      return e.preventDefault();
    }

    if (form.upload.type == 'file') {
      for (var i = 0; i < validExtensions.length; i++) {
        var re = new RegExp(validExtensions[i] + '$', 'i');
        if (!re.test(arrayOfFiles.value)) {
          alertWindow.innerHTML = ' На данный момент поддерживается только формат .gpx';
          alertWindow.style.opacity = '1';
          return e.preventDefault();
        }
      }
    }
    loadIndicator.style.display = "block";
  });

  // При отмене загрузки файла - прячет индикатор загрузки
  document.addEventListener('keyup', function(e) {
    if (e.keyCode == 27) {
      loadIndicator.style.display = "none";
    }
  });
}