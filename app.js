const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const mailchimp = require("@mailchimp/mailchimp_marketing");



mailchimp.setConfig({
    apiKey: "1957471096b33a499bbfddc86cf40b49-us8",
    server: "us8",
});

async function run() {
    const response = await mailchimp.ping.get();
    console.log(response);
}

run();

const app = express();


//1957471096b33a499bbfddc86cf40b49-us8 //api key 0ce13c3acf subid


app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.emailaddress;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]

    }
    const jsonData = JSON.stringify(data);

    const listId = "0ce13c3acf"

    const url = `https://us8.api.mailchimp.com/3.0/lists/${listId}`;

    const options = {
        method: "POST",
        auth: "ric:1957471096b33a499bbfddc86cf40b49-us8"
    }

    const request = https.request(url, options, (response) => {
        response.on('data', function (data) {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + '/success.html');
            } else {
                res.sendFile(__dirname + '/failure.html');
            }
        })
    })

    request.write(jsonData);
    request.end();



});

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port 3000');
})