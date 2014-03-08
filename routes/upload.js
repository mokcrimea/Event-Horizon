var formidable = require('formidable'),
  http = require('http'),
  util = require('util');

exports.get = function(req, res) {
  res.render('upload');
};

exports.post = function(req, res, next) {

  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {
      'content-type': 'text/plain'
    });
    res.write('received upload:\n\n');
    res.end(util.inspect({
      fields: fields,
      files: files
    }));
  });

};
