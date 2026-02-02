"use strict";
const fs = require("fs");

class FileService {
  /**
   * Appends a line to a file
   * @param {string} filePath The path to the file
   * @param {string} text The text to append
   */
  static appendLine(filePath, text) {
    fs.appendFileSync(filePath, `${text}\n`, "utf-8");
  }

  /**
   * Read all text from a file
   * @param filePath  The path to the file
   * @return {string} The content of the file
   */
  static readAllText(filePath) {
    return fs.readFileSync(filePath, "utf-8");
  }

  /**
   * Checks if a file exists
   * @param {string} filePath The path to the file
   * @return {boolean} True if the file exists, false otherwise
   */
  static exists(filePath) {
    return fs.existsSync(filePath);
  }
}

module.exports = {FileService};
