const http = require("http");
const fs = require("fs");
const YAML = require('json2yaml');
const routes = require("routes")();

var server = http.createServer((req, res) => {
  var m = routes.match(req.url);
  if (m) {
    m.fn(req, res, m.params);
  }
}).listen(3000);

routes.addRoute("/", (req, res) => {
  fs.readFile("./config.js", "utf8", (err, data) => {
    if(err) {
      res.write('Opps!! Something went wrong');
    }
    const dataObj = JSON.parse(data);
    for (let i = 0; i < dataObj.length; i++) {
      dataObj[i]["size"] = JSON.stringify(dataObj[i]).length;
    }
    let wstream = fs.createWriteStream('YAML.txt');
    wstream.on('finish', () => {
      console.log('File has been written');
    })
    wstream.write(YAML.stringify(dataObj));
    wstream.end(() => {
      res.write('File has been written');
      res.end();
    });
  });
});
