var path = require('path');

var DATA_ROOT = './';

exports.filePath = function (relPath, decodeURI) {

  if (decodeURI) {
      relPath = decodeURIComponent(relPath);
      console.log("fileMap.js filePath(), relPath : ",relPath);
  }
  if (relPath.indexOf('..') >= 0){
      console.log("fileMap.js filePath(), decodeURI if: ",decodeURI);
    var e = new Error('Do Not Contain .. in relPath!');
    e.status = 400;
    throw e;
  }
  else {
      console.log("fileMap.js filePath(), decodeURI else: ",decodeURI);
      console.log("fileMap.js filePath(), path.join(DATA_ROOM,relPath)",path.join(DATA_ROOT, relPath));
      console.log("fileMap.js filePath(), DATA_ROOM : ",DATA_ROOT)
      console.log("fileMap.js filePath(), relPath : ",relPath)
    return path.join(DATA_ROOT, relPath);
  }
};
