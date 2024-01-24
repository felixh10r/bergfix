const express = require("express");
const axios = require("axios");
const modifyContent = require("./modifyContent");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  const { path, greyscale, showClock, showDetails, zoom, numCols } = req.query; // get url parameter
  if (!path) {
    res.type("text/html");
    return res.end("You need to specify <code>path</code> query parameter");
  }

  axios
    .get(`https://www.bergfex.at${path}`, { responseType: "arraybuffer" }) // set response type array buffer to access raw data
    .then(({ data }) => {
      data = modifyContent(data.toString(), {
        showClock,
        showDetails,
        zoom,
        greyscale,
        numCols,
      });

      res.type("text/html");
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
