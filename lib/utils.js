/**
 * Возвращает дату в формате D.M.Y H:M
 * @param  {String} date
 * @return {String}
 */
exports.formatDate = function(date) {
  var year = date.getFullYear().toString().substr(2);
  var month = date.getMonth();
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;
};
