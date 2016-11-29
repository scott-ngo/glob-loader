"use strict";

var glob = require("glob");
var path = require("path");

module.exports = function (content, sourceMap) {
  this.cacheable && this.cacheable();
  var resourceDir = path.dirname(this.resourcePath);
  var config = JSON.parse(content);
  var pattern = config.pattern;
  var files = glob.sync(pattern, {
    cwd: resourceDir
  });

  if (!files.length) {
    this.emitWarning('Did not find anything for glob "' + pattern + '" in directory "' + resourceDir + '"');
  }

  return "module.exports = {\n" + files.map(function (file) {
    this.addDependency(path.resolve(resourceDir, file));

    var stringifiedFile = JSON.stringify(file);

    if(config.hash === true) 
      return "\t" + JSON.stringify(path.basename(file, '.js')) + ": require(" + stringifiedFile + ")";
    else
      return "\t" + JSON.stringify(file.slice(0,-3)) + ": require(" + stringifiedFile + ")";    
  }, this).join(",\n") + "\n};"
};
