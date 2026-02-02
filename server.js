/**
 * AI Acknowledgement:
 * ChatGPT was used at following places:
 * 1. Made the constructor and explain .bind()
 * 2. Explain how to load JSON file
 * 3. Review for requirement compliance
 * 4. Deploy
 */
// Libraries
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

// Modules
const {Utils} = require("./modules/utils");
const {FileService} = require("./modules/fileService");

// Constants
const STATUS_CODE = {
  OK: 200,
  NOT_FOUND: 404,
};
const MESSAGE_NOT_FOUND = "404 Not Found";
const MESSAGE_NO_FILENAME = "No filename provided";
const URL_GET_DATE = "/COMP4537/labs/3/getDate/";
const URL_WRITE_FILE = "/COMP4537/labs/3/writeFile/";
const URL_READ_FILE = "/COMP4537/labs/3/readFile/";

class server {
  /**
   * Constructor for creating a new server instance
   * @param {number} port The port number to listen
   */
  constructor(port) {
    this.port = port;
    const langPath = path.join(__dirname, "lang", "en", "en.json");
    const lang = JSON.parse(fs.readFileSync(langPath, "utf-8"));
    this.getDatePrefix = lang.getDatePrefix;
    this.server = http.createServer(this.handleRequest.bind(this));
  }

  /**
   * Start the server
   */
  start() {
    this.server.listen(this.port);
    console.log(`Server running on port ${this.port}`);
  }

  /**
   * Handle the request
   * @param {http.IncomingMessage} req Request
   * @param {http.ServerResponse} res Response
   */
  handleRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // B: Get Date
    if (url.pathname === URL_GET_DATE && url.searchParams.has("name") && req.method === "GET") {
      const name = url.searchParams.get("name");
      const message = `${this.getDatePrefix.replace("%1", name)} * ${Utils.getDate()}`;

      res.writeHead(STATUS_CODE.OK, {"Content-Type": "text/html; charset=utf-8"});
      res.end(`<div style="color: blue;">${message}</div>`);
      return;
    }

    // C1: Append file
    if (url.pathname === URL_WRITE_FILE && url.searchParams.has("text") && req.method === "GET") {
      const text = url.searchParams.get("text");
      const filePath = path.join(__dirname, "file.txt");

      FileService.appendLine(filePath, text);
      res.writeHead(STATUS_CODE.OK, {"Content-Type": "text/plain; charset=utf-8"});
      res.end();
      return;
    }

    // C2: Read file
    if (url.pathname.startsWith(URL_READ_FILE) && req.method === "GET") {
      const filename = url.pathname.substring(URL_READ_FILE.length);
      const filePath = path.join(__dirname, filename);

      if (!filename || !FileService.exists(filePath)) {
        res.writeHead(STATUS_CODE.NOT_FOUND, {"Content-Type": "text/html; charset=utf-8"});
        res.end(`<div>${MESSAGE_NOT_FOUND}: ${filename || MESSAGE_NO_FILENAME}</div>`);
        return;
      }

      const content = FileService.readAllText(filePath);
      res.writeHead(STATUS_CODE.OK, {"Content-Type": "text/plain; charset=utf-8"});
      res.end(content);
      return;
    }

    res.writeHead(STATUS_CODE.NOT_FOUND, {"Content-Type": "text/html; charset=utf-8"});
    res.end(`<div>${MESSAGE_NOT_FOUND}</div>`);
  }
}

/* starter */
const port = process.env.PORT || 3000;
new server(port).start();
