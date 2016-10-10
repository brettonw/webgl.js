"use strict;"

#ifdef DEBUG

let LogLevel = function () {
    let _ = Object.create (null);

    _.TRACE = 0;
    _.INFO = 1;
    _.WARNNG = 2;
    _.ERROR = 3;

    // default
    let logLevel = _.ERROR;

    _.set = function (newLogLevel) {
        logLevel = newLogLevel;
    };

    let formatStrings = [ "TRC", "INF", "WRN", "ERR" ];
    _.say = function (messageLogLevel, message) {
        if (messageLogLevel >= logLevel) {
            console.log (formatStrings[logLevel] + ": " + message)
        }
    };

    return _;
} ();

#define SET_LOG_LEVEL(logLevel) LogLevel.set (logLevel)
SET_LOG_LEVEL(LogLevel.INFO);

#define LOG(level, message) LogLevel.say (level, message)
#define DEBUGGER debugger

#else

#define SET_LOG_LEVEL(logLevel)
#define LOG(level, message)
#define DEBUGGER

#endif

// class hierarchy
#define SUPER   Object.getPrototypeOf(_)

// default values...
#define DEFAULT_VALUE(value, defaultValue) (((typeof value !== "undefined") && (value != null)) ? value : defaultValue)
#define DEFAULT_FUNCTION(value, defaultFunction) (((typeof value !== "undefined") && (value != null)) ? value : defaultFunction ())
