var es = require('event-stream'),
  clone = require('clone'),
  path = require('path');

module.exports = function(opt){
  // clone options
  opt = opt ? clone(opt) : {};
  if (!opt.splitter) opt.splitter = '\r\n';

  if (!opt.fileName) throw new Error("Missing fileName option for gulp-concat");

  var buffer = [];
  function bufferContents(file){
    // clone the file so we arent mutating stuff
    buffer.push(clone(file));
  }

  function endStream(){
    if (buffer.length === 0) return this.emit('end');

    var joinedContents = buffer.map(function(file){
      return file.contents;
    }).join(opt.splitter);

    var joinedPath = path.join(path.dirname(buffer[0].path), opt.fileName);

    var joinedFile = {
      shortened: opt.fileName,
      path: joinedPath,
      contents: joinedContents
    };

    this.emit('data', joinedFile);
    this.emit('end');
  }

  return es.through(bufferContents, endStream);
};