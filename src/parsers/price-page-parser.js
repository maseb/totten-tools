"use strict";

var mod = function(
  _,
  Promise,
  Options,
  jsdom,
  md5
) {

  var PricePageParser = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(PricePageParser.prototype, {
    initialize: function(opts) {
      opts = Options.fromObject(opts);
      this._jquery = opts.getOrError("jqueryPath");
    },

    parse: Promise.method(function(contents) {
      return new Promise(_.bind(function(resolve, reject) {
        jsdom.env({
          html: contents,
          scripts: [this._jquery],
          done: _.bind(function(errors, win) {
            var $ = win.$;
            this
              ._extractRecords($)
              .then(function(records) {
                resolve(records)
              }).caught(function(err) {
                reject(err);
              });
          }, this)});
      }, this));
    }),
    _extractRecords: Promise.method(function($) {
      var tableRows = $("tr");
      var finalRows = [];
      tableRows.each(function() {
        var row = $(this),
            key = $("td", row).first().text();

        if (!key) return;

        var id = md5(key);

        var rest = _.map($("td", row), function(td) {
          return $(td).text();
        });

        rest.unshift(id);
        finalRows.push(rest);
      });
      console.log(finalRows);
      return finalRows;
    })
  });

  return PricePageParser;
};

module.exports = mod(
  require("underscore"),
  require("bluebird"),
  require("thicket").c("options"),
  require("jsdom"),
  require("MD5")
);
