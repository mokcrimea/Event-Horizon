var formidable = require('formidable'),
  fs = require("fs");


exports.get = function(req, res) {
  res.render('upload');
};

exports.post = function(req, res, next) {
  console.log("The 'upload' route was called.");

  var form = new formidable.IncomingForm();
  console.log("Start parsing");
  form.parse(req, function(error, fields, files) {
    console.log("parsing");

    fs.rename(files.upload.path, "/tmp/test.png", function(err) {
      if (err) {
        fs.unlink("/tmp/test.png");
        fs.rename(files.upload.path, "/tmp/test.png");
      }
    });
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write("received image:<br/>");
    res.write("<img src='/show' />");
    res.end();
  });
};
