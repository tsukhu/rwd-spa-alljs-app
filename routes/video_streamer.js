var fs = require('fs'),
    path = require('path');

function startsWith(str, prefix) {
    return str.lastIndexOf(prefix, 0) === 0;
}
 
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

// Stream Video with support for different formats and device request for chunks
exports.streamMovie = function(req, res) {

  // Get the filename
  var movieFileName ="";
 
  if (req.params.fileName) {
 	movieFileName = req.params.fileName;
  }
 
  var streamPath = path.resolve(__dirname,"../public/video/"+movieFileName);
  //Calculate the size of the file
  var stat = fs.statSync(streamPath);
  var total = stat.size;
  var file;
  var contentType="video/mp4";
  
  if (endsWith(movieFileName,".ogg")) {
  	contentType="video/ogg";
  }
  
  if (endsWith(movieFileName,".webm")) {
  	contentType="video/webm";
  }
  
  // Chunks based streaming
  if (req.headers.range) {
    var range = req.headers.range;
    var parts = range.replace(/bytes=/, "").split("-");
    var partialstart = parts[0];
    var partialend = parts[1];
 
    var start = parseInt(partialstart, 10);
    var end = partialend ? parseInt(partialend, 10) : total-1;
    var chunksize = (end-start)+1;
    console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);
 
    file = fs.createReadStream(streamPath, {start: start, end: end});
    res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': contentType });
    res.openedFile = file; 
    file.pipe(res);
  } else {
    console.log('ALL: ' + total);
    file =  fs.createReadStream(streamPath);
    res.writeHead(200, { 'Content-Length': total, 'Content-Type': contentType });
    res.openedFile = file; 
	file.pipe(res);
  }
  
   res.on('close', function(){
          console.log('response closed');
          if (res.openedFile) {
          res.openedFile.unpipe(this);
          fs.close(this.openedFile.fd);
          }
     });
            
};





