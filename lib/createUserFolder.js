var fs = require('fs');

function createFolders(id, callback) {
  trackFolder = '/tmp/' + id;
  if (fs.existsSync(trackFolder) === false) {
    fs.mkdirSync(trackFolder);
  }
  callback(null);
}


module.exports = createFolders;
