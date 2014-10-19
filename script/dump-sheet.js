var thicket      = require("thicket"),
    Bootstrapper = thicket.c("bootstrapper"),
    DumpSheet    = require("../src/dump-sheet"),
    Logger       = thicket.c("logger"),
    CLA          = thicket.c("appenders/console-log");

Logger.root().setLogLevel(Logger.Level.Debug);
Logger.root().addAppender(new CLA());

var b = new Bootstrapper({applicationConstructor: DumpSheet});

b
  .bootstrap()
  .then(function(app) {
    return app
      .start()
      .then(function() {
        return app.stop();
      });
  });
