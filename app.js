const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const localPort = 3000;

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;

	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	const jsonData = JSON.stringify(data);

	const url = `https://us10.api.mailchimp.com/3.0/lists/${process.env.AUDIENCE_ID}`;

	const options = {
		method: "POST",
		auth: `henry:${process.env.API_KEY}`,
	};

	const request = https.request(url, options, function (response) {
		response.on("data", function (data) {
			console.log(JSON.parse(data));
		});

		if (response.statusCode == "200") {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}
	});

	request.write(jsonData);
	request.end();
});

app.post("/failure", function (req, res) {
	res.redirect("/");
});

app.listen(process.env.PORT || localPort, function () {
	console.log(`Newsletter app is running on port 3000...`);
});
