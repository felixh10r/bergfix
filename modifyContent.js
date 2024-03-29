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
    local("Roboto Medium"),
    local("Roboto-Medium"),
    url(https://home.mei-raid.synology.me/static/fonts/roboto/Roboto-Medium.woff2) format("woff2");
  font-weight: 500;
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

module.exports = function modifyContent(data, options) {
  let result = data.toString();
  const parsed = parse(result);

  const oneHour = parsed.querySelector(".forecast1h");

  if (!oneHour) {
    return data;
  }

  const numCols = options.numCols ?? 8;

  oneHour.querySelector(".timeline").remove();
  const nineDays = parsed.querySelector(".forecast9d-container");

  // remove external scripts
  result = result.replace(/<script(.*) src="http(.*)>/g, "");

  // language=CSS
  result = result.replace(
    /<body(.*)<\/body>/s,
    `
<body class="bergfix cols-${numCols}">
  <style>
    ${FONT_FACE_ROBOTO}

    body.bergfix {
      font-family: Roboto !important;
      letter-spacing: initial;
      min-height: initial;
    }
    
    #clock {
      margin: 24px;
      font-weight: normal;
    }
   
    #clock:empty {
      margin: 8px;
    }
    
    svg,
    .forecast1h .time:last-child,
    .forecast9d-container .fields:last-of-type,
    /* hide percentage */
    .day>:nth-child(4),
    /* hide 9th day */
    .time:nth-child(9),
    .day:nth-child(9) {
      display: none;
    }
    
    .cols-6 .time:nth-child(7),
    .cols-6 .day:nth-child(7),
    .cols-6 .time:nth-child(8), 
    .cols-6 .day:nth-child(8) {
      display: none;
    }
    
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
      options.showDetails
        ? ""
        : `
.ff, .rrp {
  display: none;
}
    `
    }
    
    ${
      options.greyscale
        ? `
.bergfix .fields .tmin, .bergfix .fields .tmax, .bergfix .temperature,  .bergfix .rrp {
  color: black;
}

img {
    filter: grayscale(100%) contrast(160%) brightness(80%);
}
    `
        : ""
    }
    
    ${
      options.showDetails
        ? ""
        : `
.ff, .rrp {
  display: none;
}
    `
    }
    
    .forecast1h {
      width: auto;
      margin: 0 0 4px;
    }
    
    .forecast1h .time .label,
    .forecast9d-container .day .date {
      font-weight: 500;
      font-size: 12px;
    }
    
    .forecast1h .icon {
      margin: -2px 0 0 -3px;
      visibility: visible !important;
    }
    
    .forecast1h .temperature {
      margin-top: -16px;
    }
    
    .forecast1h .rrr {
      /* avoid layout shift when rain is present */
      height: 21px;
    }
    
    .forecast1h .temperature,
    .fields .tmax {
      font-weight: 500;
    }
    
    .forecast1h .temperature,
    .fields .tmax,
    .day .rrr,
    .day .sonne {
      font-size: 13px;
    }
    
    .forecast1h .icon,
    .forecast1h .rrr,
    .forecast1h .rrp {
      left: 0;
    }
    
    /* 1/8 */
    .forecast1h .time,
    .forecast9d-container .fields {
      width: 12.5%;
    }
    
    /* 1/6 */
    .cols-6 .forecast1h .time,
    .cols-6 .forecast9d-container .fields {
      width: 16.666%;
    }
    
    .forecast9d-container .fields.trend,
    .forecast9d-container .fields {
      background-image: none;
    }
    
    .fields > div {
      border: none;
    }
    
    .fields .tmin,
    .fields .sonne {
      font-weight: 400;
    }
    
    .fields .tmin {
      margin-top: -4px;
    }
    
    .day .group {
      padding-bottom: 0;
    }
    
    /* move temperature */
    .day > :nth-child(3) {
      margin-top: -18px;
      padding-bottom: 4px;
    }
    
    /* swap sun hours and rain */
    .day > :nth-child(5) {
      display: flex;
      flex-direction: column;
    }
    .day .sonne {
      order: 1;
    }
    .day .rrr {
      order: 2;
    }
    .day .ff {
      order: 3;
    }
    
    .touch-scroll-x {
      overflow: hidden;
    }

  </style>
  <h1 id="clock"></h1>
  ${
    options.showClock
      ? `
  <script>
    setInterval(() =>
      document
        .getElementById("clock")
        .textContent = new Date().toLocaleString("de-DE", {weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric"}).replace(" um ", ", ")
    , 1000)
  </script>
  `
      : ""
  }
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
