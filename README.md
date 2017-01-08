# parse-http-chunked-response
Parses the body stream of HTTP 1.1 chunked response

# Usage
```javascript
const http = require('http');
const parseHeaderStream = require('parse-header-stream');

http.get('http://sample.com/chunked-response-endpoint', (res)=>{
    res.pipe(parseHeaderStream({})).on('body',(bodyStream)=>{
        bodyStream.pipe(new ParseHttpChunkedStream()).on('data', (httpChunk)=>{ console.log(`Got a complete HTTP chunk!`); });
    });
});
```