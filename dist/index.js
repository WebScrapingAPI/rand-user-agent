import { JSONfrequencyNormalize, JSONIsFrequency, JSONinterval, randomElement, } from "./helpers.js";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let content = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/user-agents.json"), "utf8"));
content = JSONfrequencyNormalize(content);
if (JSONIsFrequency(content)) {
    content = JSONinterval(content);
}
export default function (device, browser = null, os = null) {
    let options = [];
    const keys = Object.keys(content);
    for (const index in keys) {
        let filter = true;
        if (keys[index].indexOf(device) === -1) {
            filter = false;
        }
        if (browser && keys[index].indexOf(browser) === -1) {
            filter = false;
        }
        if (os && keys[index].indexOf(os) === -1) {
            filter = false;
        }
        if (filter) {
            options.push(keys[index]);
        }
    }
    if (options.length === 0) {
        return randomElement(content);
    }
    return randomElement(content[options[Math.floor(Math.random() * options.length)]]);
}
