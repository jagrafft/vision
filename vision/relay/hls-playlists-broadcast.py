#!/usr/local/bin/python
import json
import os

from http.server import BaseHTTPRequestHandler, HTTPServer

class HttpServer(BaseHTTPRequestHandler):
    def do_GET(self):
        print("GET")
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(bytes(json.dumps(sorted(list(map(lambda x: os.path.join(x[0], x[2][0]),filter(lambda x: "playlist.m3u8" in x[2], os.walk("test")))))), "utf-8"))

httpServer = HTTPServer(("", 3000), HttpServer)

try:
    httpServer.serve_forever()
except KeyboardInterrupt:
    pass

httpServer.server_close()