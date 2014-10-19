"use strict";

var mod = function(
  _,
  Promise,
  App
) {

  var DumpSheet = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(DumpSheet.prototype, App.prototype, {
    up: Promise.method(function() {
      var inFile    = this.config("inFile"),
          outFile   = this.config("outFile"),
          outFormat = this.config("outFormat");

      return Promise
        .bind(this)
        .then(function() {
          return this._readInFile(inFile);
        })
        .then(function(fileContents) {
          return this._index(fileContents);
        })
        .then(function(indexedContents) {
          return this._writeAs(outFormat, indexedContents, outFile);
        });
    }),

    _readInFile: Promise.method(function(filePath) {}),
    _index: Promise.method(function(fileContents) {}),
    _writeAs: Promise.method(function(format, contents, filePath) {})
  });

  return DumpSheet;
};

module.exports = mod(
  require("underscore"),
  require("bluebird"),
  require("thicket").c("app")
);
