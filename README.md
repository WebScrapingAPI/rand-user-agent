# rand-user-agent package

rand-user-agent is a nodejs package that provides random generation of a real user agent string, based on the frequency the user agents occur.

## How does it work

Using our own database with data about guests and their user-agent, we update a file called "user-agents.json" on a weekly basis with new information. 

This data is saved in a json under the following format:

```
{
    deviceType1: {
        userAgent1: frequencyUserAgent1,
        userAgent2: frequencyUserAgent2,
        ...
    }
    ...
}
```

Because sometimes one userAgent might occur so many times that it will end up being returned most of the times in the result, we need to normalize the frequency values to prevent that. To do so, we sort an array with all the unique values of the frequency, and replace the frequency for each user agent with the position where the frequency is in the sorted array. We are doing this using the JSONfrequencyNormalize function from helpers.js

To make things easier for us, when somebody uses the package we are first transforming the processed json into a indexes json, such as the one below:

```
{
    deviceType1: {
        userAgent1: {
            minIndex: 0,
            maxIndex: frequencyUserAgent1 - 1,
        },
        userAgent2: {
            minIndex: frequencyUserAgent1,
            maxIndex: frequencyUserAgent2 - lastMaxIndex - 1,
        },
        ...
    }
    ...
}
```

Using the data in this format allows us to easily retrieve a random userAgent, while also taking into account how often it occured in our data.

## Usage Example 

```
const randUserAgent = require('./index');
const agent = randUserAgent("desktop");

console.log(agent);

```

## .env file

This package uses .env file. If you want to update the data in user-agents.json from your own database, you should set your database connection in a .env file this way:

```
DB_HOST=database host
DB_USER=database user
DB_PASS=database pass
DB_NAME=database name
DB_PORT=database port
```
