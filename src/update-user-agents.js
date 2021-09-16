require('dotenv').config()
const helpers = require('./helpers');
const fs = require('fs');
const path = require("path");
const DeviceDetector = require("device-detector-js");

const deviceDetector = new DeviceDetector();

const { Pool, Client } = require('pg')

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false,
    },
})

let query = "SELECT context_user_agent, COUNT(context_user_agent) AS frequency FROM prod.pages  WHERE original_timestamp > date_trunc('day', NOW() - interval '3 months') GROUP BY context_user_agent";

pool.query(query, (err, res) => {
    if (typeof err === 'undefined' && typeof res !== 'undefined') {
        let content = {};

        for (let index = 0; index < res.rows.length; index++) {
            let device = deviceDetector.parse(res.rows[index].context_user_agent);
            if (device == null || !device.hasOwnProperty('device')) {
                continue;
            }
            if (device.device == null || !device.device.hasOwnProperty('type')) {
                continue;
            }

            let deviceType = device.device.type;
            if (deviceType == 'smartphone') {
                deviceType = 'mobile';
            }

            if (!content.hasOwnProperty(deviceType)) {
                content[deviceType] = {};
            }
            if (content[deviceType].hasOwnProperty(res.rows[index].context_user_agent)) {
                content[deviceType][res.rows[index].context_user_agent] += parseInt(res.rows[index].frequency);
            } else {
                content[deviceType][res.rows[index].context_user_agent] = parseInt(res.rows[index].frequency);
            }
        }

        fs.writeFileSync(path.join(__dirname, '../data/user-agents.json'), JSON.stringify(content));
    } else {
        console.log(err);
    }
    pool.end()
})