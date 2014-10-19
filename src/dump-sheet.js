"use strict";

var mod = function(
  _,
  Promise,
  App,
  PricePageParser,
  fs,
  path
) {

  var DumpSheet = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(DumpSheet.prototype, App.prototype, {
    up: Promise.method(function() {
      var inFile    = this.config("inFile"),
          outFile   = this.config("outFile"),
          parser    = new PricePageParser({
            jqueryPath: path.normalize(path.join(__dirname, "..", this.config("jqueryPath")))
          });

      this._parser = parser;

      return Promise
        .bind(this)
        .then(function() {
          return this._readInFile(inFile);
        })
        .then(function(fileContents) {
          return this._parse(fileContents);
        })
        .then(function(parsed) {
          return this._write(parsed, outFile);
        });
    }),

    _readInFile: Promise.method(function(filePath) {
      return Promise.promisify(fs.readFile, fs)(filePath, { encoding: "utf8" });
    }),

    _parse: Promise.method(function(unparsedContents) {
      return this._parser.parse(unparsedContents);
    }),

    _write: Promise.method(function(contents, filePath) {
      var csv = _.map(contents, function(row) {
        return row.join("\t");
      }).join("\n");
      return Promise.promisify(fs.writeFile, fs)(filePath, csv);
    })
  });

  return DumpSheet;
};

module.exports = mod(
  require("underscore"),
  require("bluebird"),
  require("thicket").c("app"),
  require("./parsers/price-page-parser"),
  require("fs"),
  require("path")
);
