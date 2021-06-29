const fs = require('fs');
const path = require("path");
let content = JSON.parse(fs.readFileSync(path.join(__dirname,'file.json'), 'utf8'));
function getRandomUserAgent(device) {
    switch (device) {
      case "desktop":
        return randomElement(content.desktop);
      case "tablet":
        return randomElement(content.tablet);
      case "mobile":
        return randomElement(content.mobile);
      default:
        return randomElement(content.desktop);
    }
}


function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = getRandomUserAgent;