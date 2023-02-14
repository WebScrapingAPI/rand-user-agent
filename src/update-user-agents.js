require('dotenv').config()
const helpers = require('./helpers');
const fs = require('fs');
const path = require("path");
const DeviceDetector = require("device-detector-js");
var parser = require('ua-parser-js');

const deviceDetector = new DeviceDetector();

const { Pool, Client } = require('pg');
const mysql = require('mysql2');

const pool = new Pool({
    user: process.env.PG_DB_USER,
    host: process.env.PG_DB_HOST,
    database: process.env.PG_DB_NAME,
    password: process.env.PG_DB_PASS,
    port: process.env.PG_DB_PORT,
    ssl: {
        rejectUnauthorized: false,
    },
})

var mysql_con = mysql.createConnection({
    host: process.env.MYSQL_DB_HOST,
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASS,
    database: process.env.MYSQL_DB_NAME,
});
mysql_con.connect();


// These can be changed based on your data
let query = "SELECT context_user_agent, COUNT(context_user_agent) AS frequency FROM prod.pages  WHERE original_timestamp > date_trunc('day', NOW() - interval '3 months') GROUP BY context_user_agent";
let mysql_query = "SELECT user_agent AS context_user_agent, COUNT(user_agent) AS frequency FROM user_agents  WHERE created_at > DATE_SUB(now(), INTERVAL 3 MONTH) GROUP BY user_agent"

let content = {};

function parseRow(row) {
    let device = deviceDetector.parse(row.context_user_agent);
    if (device == null || !device.hasOwnProperty('device')) {
        return;
    }
    if (device.device == null || !device.device.hasOwnProperty('type')) {
        return;
    }

    let deviceType = device.device.type;
    if (deviceType == 'smartphone') {
        deviceType = 'mobile';
    }

    var ua = parser(row.context_user_agent);

    deviceType += (ua.browser.name ? ua.browser.name.toLowerCase() : '') 
    deviceType += (ua.os.name ? ua.os.name.toLowerCase() : '')

    if (!content.hasOwnProperty(deviceType)) {
        content[deviceType] = {};
    }
    if (content[deviceType].hasOwnProperty(row.context_user_agent)) {
        content[deviceType][row.context_user_agent] += parseInt(row.frequency);
    } else {
        content[deviceType][row.context_user_agent] = parseInt(row.frequency);
    }
}

pool.query(query, (err, res) => {
    if (typeof err === 'undefined' && typeof res !== 'undefined') {
        for (let index = 0; index < res.rows.length; index++) {
            parseRow(res.rows[index])
        }
    } else {
        console.log(err);
    }
    pool.end()

    mysql_con.query(mysql_query, function (error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            for (let index = 0; index < results.length; index++) {
                parseRow(results[index])
            }
        }
        fs.writeFileSync(path.join(__dirname, '../data/user-agents.json'), JSON.stringify(content));
        process.exit()
    });
})