import os
from http.server import HTTPServer
from http.server import SimpleHTTPRequestHandler
from urllib.parse import urlparse
class potiHTTPRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        urlParams = urlparse(self.path)
        if os.access("." + os.sep + urlParams.path, os.R_OK):
            SimpleHTTPRequestHandler.do_GET(self)
        else:
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            with open("index.html", "r") as f:
                html = f.read()
            self.wfile.write(html.encode())
httpd = HTTPServer(("localhost", 8000), potiHTTPRequestHandler)
httpd.serve_forever()
