const { parse } = require("node-html-parser");

// language=css
const FONT_FACE_ROBOTO = `
@font-face {
  font-family: "Roboto";
  src:
    local("Roboto Regular"),
    local("Roboto-Regular"),
    url(https://home.mei-raid.synology.me/static/fonts/roboto/Roboto-Regular.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: "Roboto";
  src:
    local("Roboto Bold"),
    local("Roboto-Bold"),
    url(https://home.mei-raid.synology.me/static/fonts/roboto/Roboto-Bold.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
}
`;

module.exports = function modifyContent(result, options) {
  const parsed = parse(result);

  const oneHour = parsed.querySelectorAll(".splide__list")[2];

  if (!oneHour) {
    return result;
  }

  const numCols = options.numCols ?? 8;

  //oneHour.querySelector(".timeline").remove();
  const nineDays = parsed.querySelector(".forecast9d-container");

  nineDays.querySelector(".legend").remove();

  // remove scripts
  result = result.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

  // language=CSS
  result = result.replace(
    /<body(.*)<\/body>/s,
    `
<body class="bergfix cols-${numCols}">
  <style>
    ${FONT_FACE_ROBOTO}

    ${
      options.zoom
        ? `
html {
  zoom: ${options.zoom}%;
}
    `
        : ""
    }

    ${
      options.greyscale
        ? `
.bergfix .tmin, .bergfix .tmax, .bergfix .temperature,  .bergfix .rrr {
  color: black;
}

.bergfix .sonne, .bergfix .rrr {
  background-color: transparent!important;
}

img {
    filter: grayscale(100%) contrast(160%) brightness(80%);
}
    `
        : ""
    }

    body.bergfix {
      font-family: Roboto !important;
    }
   
    svg,
    .nschnee,
    .sgrenze,
    .day>:nth-child(4),
    .day>:nth-child(7),
    .day>:nth-child(8),
    .day>:nth-child(9),
    .forecast9d-container>:nth-child(7),
    .forecast9d-container>:nth-child(8),
    .forecast9d-container>:nth-child(9)
    {
      display: none;
    }
    
    /* 1/8 */
    .cols-6 .splide__slide,
    .cols-6 .forecast9d-container .day {
      width: 12.5%;
    }
    
    /* 1/6 */
    .cols-6 .splide__slide,
    .cols-6 .forecast9d-container .day {
      width: 16.666%;
    }

    .bergfix .splide__slide {
      margin-right: 0!important;
    }

    .splide__slide > div > div:first-child > div:first-child {
      font-weight: bold;
    }

    .splide__slide img {
      position: relative;
      left: 17px;
    }
        
    .forecast9d-container {
      min-width: auto;
      margin-top: 8px!important;
    }
    
    .forecast9d-container .fields.trend,
    .forecast9d-container .fields {
      background-image: none;
    }
    
    .forecast9d-container img {
      position: relative;
      left: 12px;
    }

    .fields > div {
      border: none;
    }
    
    .touch-scroll-x {
      overflow: hidden;
    }
  </style>
  ${oneHour.toString()}
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

  // remove hardcoded width
  result = result.replace(/ style="width: 495px"/, "");
  result = result.replace(/ style="width: 504px;"/, "");

  return result;
};
