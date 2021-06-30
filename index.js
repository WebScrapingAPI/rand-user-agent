const helpers = require('./helpers');
const fs = require('fs');
const path = require("path");

let content = JSON.parse(fs.readFileSync(path.join(__dirname, 'user-agents.json'), 'utf8'));
content = helpers.JSONfrequencyNormalize(content);
if (helpers.JSONIsFrequency(content)) {
    content = helpers.JSONinterval(content);
}

module.exports = function(device) {
    if (!content.hasOwnProperty(device)) {
        return helpers.randomElement(content.desktop);
    }
    return helpers.randomElement(content[device]);
};

// test2