const express = require("express");
const app = express();
const port = 8000;

app.get("/", (req, res) => {
  res.send("server is running");
});

module.exports = app;
