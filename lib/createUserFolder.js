var fs = require('fs');

function createFolders(user, track, callback) {
  userFolder = '/tmp/' + user;
  trackFolder = userFolder + '/' + track;
  console.log(fs.exists(userFolder));
  if (fs.existsSync(userFolder) === false) {
    fs.mkdirSync(userFolder);
  }
  if (fs.existsSync(trackFolder) === false) {
    fs.mkdirSync(trackFolder);
  }
  callback(null);
}


module.exports = createFolders;
