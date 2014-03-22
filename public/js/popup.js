var popup;
document.addEventListener('click', _onMouseClick, false);

/**
 * Обработчик клика по ссылке с классом 'popup-link'
 * @param {Event} e событие клика
 * @private
 */

function _onMouseClick(e) {
  if (e.target.className == 'gallery') {
    e.preventDefault();
    return openPopupFromLink(e.target);
  }
}

/**
 * Получает данные из ссылки
 * на основе этих данных создаёт попап (через createPopup) и добавляет его в DOM
 * @param {HTMLElement} link Ссылка с data-аттрибутами
 */

function openPopupFromLink(link) {
  createPopup(
    link.dataset.title,
    link.dataset.full,
    function() {
      return location.assign(link.dataset.remove);
    }
  );
}


/**
 * Создаёт DOM-узел с сообщением
 * @param {String} title Заголовок сообщение
 * @param {String} message Текст сообщения сообщение
 * @param {Function} onOk Обработчик клика по кнопке 'Да'
 */

function createPopup(title, message, onOk) {
  var temp;
  if (popup === undefined) {
    temp = document.createElement('div');
    temp.className = 'popup';
    temp.innerHTML = '<div class="title">' + title + '</div><div class="message">' + '<img src="' + message + '">' + '</div><div class="btns"> <button>Да</button> <button>Нет</button></div>';
    document.body.appendChild(temp);
    popup = document.body.lastChild;
    popup.style.display = 'block';

    popup.getElementsByTagName('button')[0].addEventListener('click', onOk, false);
    popup.getElementsByTagName('button')[1].addEventListener('click', function() {
      popup.style.display = 'none';
    }, false);
  } else {
    popup.children[0].innerHTML = title;
    popup.children[1].children[0].src = message;
    popup.getElementsByTagName('button')[0].addEventListener('click', onOk, false);
    popup.style.display = 'block';
  }
}
