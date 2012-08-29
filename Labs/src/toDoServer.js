var toDoList = new Array();

var ToDo = function(name, done) {
    this.name = name;
    this.done = done;
};

var http = require('http');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');

http.createServer(function (request, response) {

var filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './toDoClient.html';
    } else if (filePath == './createPending') {
        var body = '';

        request.on('data', function (data) {
            body +=data;
        });

        request.on('end',function(){
            var POST =  qs.parse(body);
            toDoList.push({name: POST.name, done: false, id: toDoList.length});
        });
    } else if (filePath == './createDone') {
          var body = '';

          request.on('data', function (data) {
              body +=data;
          });

          request.on('end',function(){
              var POST =  qs.parse(body);
              toDoList[POST.id].done = true;
          });
      }

    var content = fs.readFileSync('toDoClient.html');
    var extname = path.extname(filePath);
    var contentType;

    switch (extname) {
        case '.html':
            contentType = 'text/html';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        default:
            contentType = "application/json"
    }

    path.exists(filePath, function(exists) {

        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.write("[");
            console.log("[");
            toDoList.forEach(function(obj) {
                if (!obj.done && (filePath == './getPending' || filePath == './createPending')
                    || obj.done && (filePath == './getDone' || filePath == './createDone')) {
                    response.write(JSON.stringify({ name: obj.name, done: obj.done, id: obj.id }));
                    console.log(JSON.stringify({ name: obj.name, done: obj.done, id: obj.id }));
                    response.write(",");
                    console.log(",");
                }
            });
            response.end("]");
            console.log("]");
        }
    });

}).listen(8124, "127.0.0.1");

console.log('Server running at http://127.0.0.1:8124/');
