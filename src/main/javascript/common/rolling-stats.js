    let RollingStats = $.RollingStats = function () {
        let _ = CLASS_BASE;

        _.construct = function (parameters) {
            this.count = Utility.defaultValue (parameters.count, 10);
            if ("fill" in parameters) {
                this.fill = parameters.fill;
            }
            this.reset ();
        };

        _.update = function (value) {
            this.sum += value;
            if (this.history.length < this.count) {
                this.history.push(value);
            } else {
                this.sum -= this.history[this.current];
                this.history[this.current] = value;
                this.current = (this.current + 1) % this.count;
            }
            let avg = this.sum / this.history.length;
            let min = Number.POSITIVE_INFINITY;
            let max = Number.NEGATIVE_INFINITY;
            let variance = 0;
            for (let value of this.history) {
                max = Math.max (value, max);
                min = Math.min (value, min);
                let sampleVariance = (value - avg);
                variance += (sampleVariance * sampleVariance);
            }
            variance /= this.count;
            return { min: min, max: max, avg: avg, var: variance, std: Math.sqrt (variance) };
        };

        _.reset = function () {
            this.history = [];
            this.sum = 0;
            if ("fill" in this) {
                for (let i = 0; i < this.count; ++i) {
                    this.history.push (this.fill);
                    this.sum += this.fill;
                }
            }
            this.current = 0;
        };

        return _;
    } ();

