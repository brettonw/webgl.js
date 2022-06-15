    let TextFile = $.TextFile = function () {
        let _ = ClassNamed ($.CLASS_NAME_REQUIRED);

        _.construct = function (parameters) {
            LOG (LogLevel.INFO, "TextFile: " + parameters.name);

            // there must be a url
            if (typeof parameters.url === "undefined") throw "TextFile URL Required";

            let scope = this;
            let request = new XMLHttpRequest ();
            request.onload = function (event) {
                if (request.status === 200) {
                    scope.text = request.responseText;
                }

                // call the onReady handler if one was provided
                if (typeof parameters.onReady !== "undefined") {
                    parameters.onReady.notify (scope);
                }
            };
            request.open ("GET", parameters.url);
            request.send ();
        };

        return _;
    } ();
