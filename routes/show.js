var fs = require("fs");

exports.get = function(req, res, next) {
 console.log("The 'show' route was called.");

  fs.readFile("/tmp/test.png", "binary", function(error, file) {

  if (error) {
    next(new HttpError(500, error)); //надо убедиться в работоспособности этого
    // res.writeHead(500, {"Content-Type": "text/plain"});
    // res.write(error + "\n");
    res.end();
  } else {
    res.writeHead(200, {"Content-Type": "image/png"});
    res.write(file, "binary");
    res.end();
  }
  });

};
