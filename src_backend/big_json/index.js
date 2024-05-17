const { JsonStreamStringify } = require('json-stream-stringify');
const JSONStream = require('JSONStream');
const intoStream = require('./into-stream');
const through2 = require('through2');

module.exports = {
    createStringifyStream: (options) => {
        let stream = new JsonStreamStringify(options.body, null, null, false, 1 * 1024 * 1024);
        stream.on('data', function (strChunk) {
            options.onData && options.onData(strChunk);
        });
        stream.on('end', function () {
            options.onEnd && options.onEnd();
        });
        stream.on('error', function (err) {
            options.onError && options.onError(err);
        });
    },
    createParseStream: (options) => {

        function parseStream (){
            let accumulator = null;
            const parseStream = JSONStream.parse('$*');
            const wrapperStream = through2.obj(
                function write(chunk, enc, cb) {
                    // try to be clever (oh noes). assume we parse objects by default.
                    // if the stream starts and it looks like an array, set the
                    // starting value of the accumulator to an array. we opt into the
                    // array, with default accumulator as an object. this introduces
                    // less risk with this feature for any unexpected circumstances
                    // (hopefully).
                    if (accumulator === null) {
                        const chunkStr = chunk.toString(enc).trim();
                        // if the trimmed chunk is an empty string, delay initialization
                        // of the accumulator till we get something meaningful
                        if (chunkStr !== '') {
                            if (chunkStr.charAt(0) === '[') {
                                accumulator = [];
                            } else {
                                accumulator = {};
                            }
                        }
                    }
                    parseStream.write(chunk);
                    return cb();
                },
                function flush(cb) {
                    parseStream.on('end', function () {
                        return cb(null, accumulator);
                    });
                    parseStream.end();
                }
            );

            parseStream.on('data', function (chunk) {
                // this syntax should work when accumulator is object or array
                accumulator[chunk.key] = chunk.value;
            });

            // make sure error is forwarded on to wrapper stream.
            parseStream.on('error', function (err) {
                wrapperStream.emit('error', err);
            });

            return wrapperStream;
        }

        const sourceStream = intoStream(options.body);
        const _parseStream = parseStream();
        _parseStream.on('data', function (data) {
            return options.onData && options.onData(data);
        });

        _parseStream.on('error', function (err) {
            return options.onError && options.onError(data);
        });

        sourceStream.pipe(_parseStream);
    }
}