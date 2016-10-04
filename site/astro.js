// starmaps: https://svs.gsfc.nasa.gov/3895
// earth night textures: http://visibleearth.nasa.gov/view.php?id=79765
//                       http://visibleearth.nasa.gov/view.php?id=55167
// earth day textures: http://visibleearth.nasa.gov/view_cat.php?categoryID=1484&p=1
// earth cloud textures: http://visibleearth.nasa.gov/view.php?id=57747
// realtime cloud coverage: http://weather.msfc.nasa.gov/GOES/getsatellite.html
//                          http://cloudsgate2.larc.nasa.gov/index.html

// MODIS imagery: https://cdn.earthdata.nasa.gov/conduit/upload/946/MODIS_True_Color.pdf
// realtime terr and aqua MODIS imagery: https://lance.modaps.eosdis.nasa.gov/cgi-bin/imagery/realtime.cgi?date=2016275

// YYY THIS ONE YYY - special... http://www.ospo.noaa.gov/Products/imagery/
// VISIBLE:    http://www.ospo.noaa.gov/data/imagery/gmgsi/GLOBCOMPVIS.2016100315.gif (update every 3 hours, change 2016100315 to 2016100318, 2016100321, etc.
// LONG WAVE:  http://www.ospo.noaa.gov/data/imagery/gmgsi/GLOBCOMPLIR.2016100315.gif
// SHORT WAVE: http://www.ospo.noaa.gov/data/imagery/gmgsi/GLOBCOMPSIR.2016100315.gif

// interesting: http://www.ncdc.noaa.gov/gibbs/
// ftp://geo.msfc.nasa.gov/Weather/
// ftp://geo.msfc.nasa.gov/Weather/TLE/  (I can get track information here)

// moon position: http://www.geoastro.de/elevazmoon/basics/index.htm
// http://astro.wsu.edu/worthey/astro/html/lec-celestial-sph.html
// http://www.stjarnhimlen.se/comp/tutorial.html
// https://www.astronomyhouston.org/sites/default/files/presentations/HAS_Novice_Program_Celestial_Coordinates.pdf


// mean earth radius: 6,378.1370 km
// midlevel clouds to cirrus layer is 2,000m to 6,000m

// celestial coordinate system uses vernal equinox as its origin, RA measures eastward, counter-
// clockwise (viewed from above), in the direction of Earth's rotation (measured in hours, minutes,
// seconds, fractional seconds), DEC measures angle positively from equator to north pole
// (measured in angles degrees). So, the Sun's RA/DEC position
// * vernal equinox is (0 hours, 0 degrees)
// * summer solstice is (6 hours, 23.5 degrees)
// * autumnal equinox is (12 hours, 0 degrees)
// * winter solstice is (18 hours, -23.5 degrees)

// ecliptic plane is at 23.5 degrees ()

// sidereal period (rotation of Earth around sun) of Earth is 365.25 days ()

// we will work in J2000

// PASSWORD: 2SeeTheClouds

/**
 *
 * @param hourAngle {Object} hour angle components ([degrees or hours], minutes, seconds)
 * @param minutes
 * @param seconds
 * @param fractional
 * @returns {number}
 */
let angleToRadians = function (angle) {
    let seconds = angle.seconds;
    let minutes = angle.minutes + (seconds / 60);
    let circleFraction;
    if ("hours" in angle) {
        let hours = angle.hours + (minutes / 60);
        circleFraction = (hours / 24.0);
    } else if ("degrees" in angle) {
        let degrees = angle.degrees + (minutes / 60);;
        circleFraction = degrees / 360.0;
    }
    return circleFraction * 2 * Math.PI;
};

let angleToDegrees = function (angle) {
    let seconds = angle.seconds;
    let minutes = angle.minutes + (seconds / 60);
    let circleFraction;
    if ("hours" in angle) {
        let hours = angle.hours + (minutes / 60);
        circleFraction = (hours / 24.0);
    } else if ("degrees" in angle) {
        let degrees = angle.degrees + (minutes / 60);;
        circleFraction = degrees / 360.0;
    }
    return circleFraction * 360.0;
};

let testHourAngleToRadians = function () {
    let affirm = function (description, value, expect) {
        let pass = Math.abs (value - expect) < 1.0e-6;
        if (! pass) {
            console.log (description + ", got (" + value + "), expected (" + expect + "): FAIL");
        }
    };

    affirm ("1h", angleToRadians ({ hours: 1, minutes: 0, seconds: 0 }), (1 / 24) * (2 * Math.PI));
    affirm ("2h", angleToRadians ({ hours: 2, minutes: 0, seconds: 0 }), (2 / 24) * (2 * Math.PI));

    affirm ("1h 30m", angleToRadians ({ hours: 1, minutes: 30, seconds: 0 }), (1.5 / 24) * (2 * Math.PI));
    affirm ("1h 31m", angleToRadians ({ hours: 1, minutes: 31, seconds: 0 }), ((1 + (31 / 60)) / 24) * (2 * Math.PI));

    affirm ("1h 30m 30s", angleToRadians ({ hours: 1, minutes: 30, seconds: 30 }), ((1 + (30 / 60) + (30 / (60 * 60))) / 24) * (2 * Math.PI));
    affirm ("1h 30m 31s", angleToRadians ({ hours: 1, minutes: 30, seconds: 31 }), ((1 + (30 / 60) + (31 / (60 * 60))) / 24) * (2 * Math.PI));
} ();

String.prototype.test = function (re) {
    return re.test (this);
};

let angleFromString = function (string) {
    // ε = 23° 26′ 21″.406 − 46″.836769 T − 0″.0001831 T2 + 0″.00200340 T3 − 0″.576×10−6 T4 − 4″.34×10−8 T5
    // ε = 23° 26′ 21.45″ − 46.815″ T − 0.0006″ T2 + 0.00181″ T3
    // "1h 30m 31s"
    let result = Object.create (null);
    let components = string.split (/[″"s]\s*/i);
    let fractional = parseFloat (((components.length > 1) && (components[1].length > 0)) ? components[1] : 0);
    components = components[0].split (/[′'m]\s*/i);
    result.seconds = parseFloat (((components.length > 1) && (components[1].length > 0)) ? components[1] : 0) + fractional;

    if (string.test (/[°d]/)) {
        components = components[0].split (/[°d]\s*/i);
        result.minutes = parseFloat (((components.length > 1) && (components[1].length > 0)) ? components[1] : 0);
        result.degrees = parseFloat (components[0]);
    } else {
        components = components[0].split (/[h]\s*/i);
        result.minutes = parseFloat (((components.length > 1) && (components[1].length > 0)) ? components[1] : 0);
        result.hours = parseFloat (components[0]);
    }
    return result;
};

let bareObjectToString = function (bareObject) {
    let result = "";
    for (component in bareObject) {
        result += component + ": " + bareObject[component] + " ";
    }
    return result;
};

let testHourAngleFromString = function () {
    let affirm = function (angleString, expect) {
        let test = angleFromString (angleString);
        let pass = true;
        for (component in test) {
            pass &= ((component in expect) && (expect[component] == test[component]));
        }
        if (! pass) {
            console.log (angleString + ", got (" + bareObjectToString (test) + "), expected (" + bareObjectToString (expect) + "): FAIL");
        }
    };
    affirm ("23° 26′ 21″.406", { degrees: 23, minutes: 26, seconds: 21.406 });
    affirm ("23° 26′ 21.45″", { degrees: 23, minutes: 26, seconds: 21.45 });
    affirm ("1h 30m 31s", { hours: 1, minutes: 30, seconds: 31 });
    affirm ("46″.836769", { hours: 0, minutes: 0, seconds: 46.836769 });
} ();

let eclipticPlaneObliquity = function (t) {
    // ε = 23° 26′ 21″.406 − 46″.836769 T − 0″.0001831 T2 + 0″.00200340 T3 − 0″.576×10−6 T4 − 4″.34×10−8 T5
    let e = angleToRadians(angleFromString ("23° 26′ 21″.406"));
    e -= (angleToRadians(angleFromString ("0° 0′ 46″.836769"))) * t;
    e -= (angleToRadians(angleFromString ("0° 0′ 0.0001831″"))) * t * t;
    e -= (angleToRadians(angleFromString ("0° 0′ 0.00200340″"))) * t * t * t;
    e -= (angleToRadians(angleFromString ("0° 0′ 5.76e−7″"))) * t * t * t * t;
    e -= (angleToRadians(angleFromString ("0° 0′ 4.34e−8″"))) * t * t * t * t *t;
    return e;
} (16 / 100);
console.log("Ecliptic Plane Obliquity: " + eclipticPlaneObliquity + "rad");
