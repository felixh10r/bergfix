const { parse } = require("node-html-parser");

const FONT_FACE_ROBOTO = `
@font-face {
  font-family: "Roboto";
  src:
    local("Roboto Thin"),
    local("Roboto-Thin"),
    url(https://home.mei-raid.synology.me/static/fonts/roboto/Roboto-Thin.woff2) format("woff2");
  font-weight: 100;
  font-style: normal;
}

@font-face {
  font-family: "Roboto";
  src:
    local("Roboto Light"),
    local("Roboto-Light"),
    url(https://home.mei-raid.synology.me/static/fonts/roboto/Roboto-Light.woff2) format("woff2");
  font-weight: 300;
  font-style: normal;
}

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

@font-face {
  font-family: "Roboto";
  src:
    local("Roboto Black"),
    local("Roboto-Black"),
    url(https://home.mei-raid.synology.me/static/fonts/roboto/Roboto-Black.woff2) format("woff2");
  font-weight: 900;
  font-style: normal;
}
`;

module.exports = function modifyContent(data) {
  let result = data.toString();
  const parsed = parse(result);

  const oneHour = parsed.querySelector(".forecast1h");

  if (!oneHour) {
    return data;
  }

  oneHour.querySelector(".timeline").remove();
  const nineDays = parsed.querySelector(".forecast9d-container");

  // remove external scripts
  result = result.replace(/<script(.*) src="http(.*)>/g, "");

  result = result.replace(
    /<body(.*)<\/body>/s,
    `
<body class="bergfix">
  <style>
    ${FONT_FACE_ROBOTO}
    
    body.bergfix {
      font-family: Roboto!important;
      letter-spacing: initial;
    }
    
    svg {
      display: none;
    }
    
    #clock {
      margin: 24px;
      font-weight: normal;
    }
    
    .forecast1h {
      position: relative;
      left: 11px;
    }
    
    .forecast1h .time .label, .forecast9d-container .day .date {
      font-weight: 500;
      font-size: 12px;
    }
    
    .forecast1h .icon {
      margin: -2px 0 0 -3px;
      left: 0;
      visibility: visible!important;
    }
    
    .forecast1h .temperature {
      margin-top: -16px;
    }
    
    .forecast1h .temperature, .fields .tmax, .day .sonne {
      font-weight: 500;
      font-size: 13px;
    }
    
    .day .rrr {
      font-size: 13px;
    }
    
    .forecast9d-container .fields.trend, .forecast9d-container .fields {
      background-image: none;
    }
    
    .fields .tmin {
      font-weight: normal;
      margin-top: -4px
    }
    
    .day .group {
      padding-bottom: 0;
    }
    
    /* move temperature */
    .day>:nth-child(3){
      margin-top: -18px;
      padding-bottom: 6px;
    }
    
    /* hide percentage */
    .day>:nth-child(4) {
      display: none;
    }
  </style>
  <h1 id="clock"></h1>
  <script>
    setInterval(() =>
      document
        .getElementById("clock")
        .textContent = new Date().toLocaleString("de-DE", {weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric"}).replace(" um ", ", ")
    , 1000)
  </script>
  ${oneHour.toString()}
  <div style="height: 16px"></div>
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

  return result;
};
