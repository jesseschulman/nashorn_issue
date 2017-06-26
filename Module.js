var Logger = require("Logger.js");
var LOGGER = new Logger("Module");

var Module = Class.create({
    doSomething: function(arg1, arg2, arg3) {
        // does not happen when doing the require within this module
        /*
        var SubClass = require("SubClass.js");
        var s = new SubClass("first arg from Module", {"prop": "valueTwo"}, "third arg from Module");
         */

        LOGGER.info("arg1=" + arg1 + " arg2=" + arg2 + " arg3=" + arg3)
        reproduce();
    }
});

module.exports = Module;