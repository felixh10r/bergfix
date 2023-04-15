const express = require("express");
const axios = require("axios");
const mime = require("mime");
const { parse } = require("node-html-parser");

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
  const { url } = req.query; // get url parameter
  if (!url) {
    res.type("text/html");
    return res.end("You need to specify <code>url</code> query parameter");
  }

  axios
    .get(url, { responseType: "arraybuffer" }) // set response type array buffer to access raw data
    .then(({ data }) => {
      const urlMime = getMimeType(url); // get mime type of the requested url
      if (urlMime === "text/html") {
        let result = data.toString();
        const parsed = parse(result);

        const oneHour = parsed.querySelector(".forecast1h");

        if (oneHour) {
          oneHour.querySelector(".timeline").remove();
          const nineDays = parsed.querySelector(".forecast9d-container");

          result = result.replace(
            /<body(.*)<\/body>/s,
            `
<body>
  <style>
    .forecast1h {
      position: relative;
      left: 11px;
    }
    
    .time > *:not(.label):not(.temperature) {
      position: relative;
      left: -54px;
    }
  </style>
  <h1 id="time" style="margin: 24px;"></h1>
  <script>
    setInterval(() =>
      document
        .getElementById("time")
        .textContent = new Date().toLocaleString("de-DE", {weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric"}).replace(" um ", ", ")
    , 1000)
  </script>
  ${oneHour.toString()}
  <div style="height: 24px"></div>
  ${nineDays.toString()}
</body>`
          );

          result = result
            .replace("Montag", "Mo")
            .replace("Dienstag", "Di")
            .replace("Mittwoch", "Mi")
            .replace("Donnerstag", "Do")
            .replace("Freitag", "Fr")
            .replace("Samstag", "Sa")
            .replace("Sonntag", "So");
        }

        data = result;
      }
      res.type(urlMime);
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
