var CUTOFF_SIZE = 512;
function writeLog(level, message) {
    if (message && message.length > CUTOFF_SIZE) {
        print(level + " " + this.className + ": " + message.substr(0, CUTOFF_SIZE - 1) + "…");
    } else {
        print(level + " " + this.className + ": " + message);
    }
}
var Logger = Class.create({
    initialize: function (className) {
        this.className = className !== undefined ? className : "UNKNOWN_CLASS";
    },
    debug: function (message) {
        writeLog.call(this, "DEBUG", message);
    },
    warn: function (message) {
        writeLog.call(this, "WARN", message);
    },
    info: function (message) {
        writeLog.call(this, "INFO", message);
    },
    error: function (message) {
        writeLog.call(this, "ERROR", message);
    }
});
module.exports = Logger;