const express = require("express");
const axios = require("axios");
const mime = require("mime");
const modifyContent = require("./modifyContent");

const app = express();
const port = process.env.PORT || 3000;

const getMimeType = (url) => {
  if (url.indexOf("?") !== -1) {
    // remove url query so we can have a clean extension
    url = url.split("?")[0];
  }
  return mime.getType(url) || "text/html"; // if there is no extension return as html
};

app.get("/", (req, res) => {
  const { url, clock } = req.query; // get url parameter
  if (!url) {
    res.type("text/html");
    return res.end("You need to specify <code>url</code> query parameter");
  }

  axios
    .get(url, { responseType: "arraybuffer" }) // set response type array buffer to access raw data
    .then(({ data }) => {
      const urlMime = getMimeType(url); // get mime type of the requested url

      if (urlMime === "text/html") {
        data = modifyContent(data.toString(), !!clock);
      }

      res.type(urlMime);
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
