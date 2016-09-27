"use strict;"

#ifdef DEBUG

#define LOG(x) console.log (x)
#define DEBUGGER debugger

#else

#define LOG(x)
#define DEBUGGER

#endif

// default values...
#define DEFAULT_VALUE(value, defaultValue) (typeof value !== "undefined") ? value : defaultValue
#define DEFAULT_FUNCTION(value, defaultFunction) (typeof value !== "undefined") ? value : defaultFunction ()
