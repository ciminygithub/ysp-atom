'use babel';
import Product from './../product';

var httpServerRuning = false;

export default class YSPHttpServer {

    httpServer: null;
    port: null;
    complate: null;
    testServerUrlCallback: null;

    constructor(serializedState) {}

    run(callback) {
        complate = callback;
        if (httpServerRuning) {
            console.info('ysp http server is running');
            return;
        }

        var http = require('http');
        var server = http.createServer();
        server.listen(0);
        server.on('listening', function() {
            var p = server.address().port;
            server.close();
            startServer(p);
        })
    }

    stop() {
        this.httpServer.close();
        console.info('ysp http server closed');
        httpServerRuning = false;
    }

    restart() {
        stop();
        httpServerRuning = false;
        startServer(port);
    }

    isRunning() {
        return httpServerRuning;
    }

    generateZip(callback) {
        createZip(callback);
    }

    getServerPort() {
        return getPort();
    }

    getTestUrl(callback) {
        testServerUrlCallback = callback;
    }
}

function getPort() {
    if (httpServerRuning) {
        return this.httpServer.address().port;
    }
    return 0;
}

function startServer(port) {
    var url = require('url');
    var http = require('http');
    var fs = require('fs');
    var path = require('path');

    this.httpServer = http.createServer(function(req, res) {
        var action = url.parse(req.url).pathname
        if (action == '/beat') {
            res.end("success");
        } else if (action == '/closeServer') {
            res.end("server closed");
            httpServer.close();
            console.info('ysp server closed');
            httpServerRuning = false;
        } else if (action == '/log') {
            var type = url.parse(req.url, true).query.t;
            var log = decodeURI(url.parse(req.url, true).query.l);
            require('./../ysp_log.js').ysp_log(type, log);
            res.end("log end");
        } else if (action == '/android.zip') {
            var zipPath = require('./../common.js').getAndroidZipPath();
            var zipFilename = require('./../common.js').getAndroidZipFilename();
            //readfile to response
            try {
                var zipBinary = fs.readFileSync(zipPath, "binary");
                res.writeHead(200, {
                    'Content-Type': 'application/zip',
                    'Content-Disposition' : 'attachment; filename='+zipFilename+'.so'
                });
                res.write(zipBinary, "binary");
                res.end('');
            } catch (e) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end('zip not found');
            } finally {

            }
        } else if (action == '/ios.zip') {
            Product.staticBuild(function() {
                var zipPath = require('./../common.js').getCreateiOSZipPath();
                var zipFilename = require('./../common.js').getCreateiOSZipFilename();
                //readfile to response
                try {
                    var zipBinary = fs.readFileSync(zipPath, "binary");
                    res.writeHead(200, {
                        'Content-Type': 'application/zip',
                       'Content-Disposition' : 'attachment; filename='+zipFilename+'.zip'
                    });
                    res.write(zipBinary, "binary");
                    res.end('');
                } catch (e) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('zip not found');
                } finally {

                }
            });
            //   });
        }
    });
    this.httpServer.listen(port, () => {
        httpServerRuning = true;
        console.info('ysp http server success , port:' + getPort());
        if (window.testServerUrlCallback != null) {
            testServerUrlCallback('http://' + require('./../common').getLocalIp() + ':' + getPort() + '/beat');
        }
        if (window.complate != null) {
            complate(getPort());
        }
    });
}
