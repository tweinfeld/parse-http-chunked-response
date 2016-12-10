const Transform = require('stream').Transform;

module.exports = class ParseHttpChunkedStream extends Transform {
    constructor(options) {
        super(options);
        this._transform = ((counter, cache) => {
            const processChunk = () => {
                if (counter === 0) {
                    let split = cache.slice(0, 50).toString('ascii').split('\r\n');
                    if (split.length > 1) {
                        let txt = split.shift();
                        counter = parseInt(txt, 16) + 2;
                        cache = cache.slice(txt.length + 2);
                        processChunk();
                    }
                } else {
                    if (cache.length >= counter) {
                        this.push(cache.slice(0, counter - 2));
                        cache = cache.slice(counter);
                        counter = 0;
                        if (cache.length > 0) processChunk();
                    }
                }
            };

            return function (chunk, encoding, callback) {
                cache = Buffer.concat([cache, chunk]);
                processChunk();
                callback(null);
            };

        })(0, Buffer.allocUnsafe(0));
    }
};