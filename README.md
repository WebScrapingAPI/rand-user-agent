# agent-vila (A package for lastest web browsers - Using google analytics)

```
const userVila = require('agent-vila');

const agent = userVila("desktop");  // desktop, mobile, tablet

console.log(agent)

```

## This package use google analytics to get the latest browser
## You can add your files 
client_id.json
user-agent-298611-f3047e8644fd.json
to get your data. 

`update.js` is a file which update `file.json` according to data finding from google analytics. 

This package will keep updated every month for latest web browsers(Desktop/Mobile/Tablet).
