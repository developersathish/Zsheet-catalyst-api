/* 'use strict';

module.exports = (req, res) => {
	var url = req.url;

	switch (url) {
		case '/':
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.write('<h1>Hello from index.js<h1>');
			break;
		default:
			res.writeHead(404);
			res.write('You might find the page you are looking for at "/" path');
			break;
	}
	res.end();
};
*/
/*
const express = require("express");
const fetch = require("node-fetch");
const request = require("request");

const app = express();
app.use(express.json());

app.post("/createSheet", async (req, res) => {
  const { accessToken, sheetName,csvFile } = req.body;
  console.log(csvFile);
  const createSheetUrl = `https://sheet.zoho.com/api/v2/create?method=workbook.create&workbook_name=${sheetName}`
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Zoho-oauthtoken ${accessToken}`
  };
  try {
    // Creating sheet
    const createSheetRes = await fetch(createSheetUrl, {
      method: "POST",
      headers
    });
    const createSheetData = await createSheetRes.json();
    const { resource_id, workbook_url } = createSheetData;

    // Appending csv data
    const appendCsvUrl = `https://sheet.zoho.com/api/v2/${resource_id}?method=worksheet.csvdata.append&worksheet_name=Sheet1&data=${csvFile}`;
    const appendCsvRes = await request.post({ url: appendCsvUrl, headers });

    // Deleting first row
    const deleteRowUrl = `https://sheet.zoho.com/api/v2/${resource_id}?method=row.delete&worksheet_name=Sheet1&row=1`;
    const deleteRowRes = await fetch(deleteRowUrl, {
      method: "POST",
      headers
    });

    res.send({ workbook_url});

  } catch (error) {

    console.error(error);
    res.status(500).send({ message: 'Error creating sheet' });

  }
});

app.post("/login", async (req, res) => {

  const redirectURL = "https://fegafpbklpbnmlildlohikipognjcocj.chromiumapp.org/html/page-status.html"
  const clientID = "1000.4QDNGFS8E1X2XVJ4P9NQK4RL3EUITV";
  const headers = {
    "Content-Type": "application/json",

  };
  const loginURL = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${clientID}&redirect_uri=${redirectURL}&scope=email`;
  console.log(loginURL)
  try {
    // Creating sheet
    const createSheetRes = await fetch(loginURL, {
      method: "GET",
      headers
    });
    console.log(createSheetRes);
    res.status(200).send("I am Live and Ready.");
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error creating sheet' });
  }
});

app.all("/", (req, res) => {
  res.status(200).send("I am Live and Ready.");
});

module.exports = app;
 */

"use strict";
const express = require("express");
var app = express();
const catalyst = require("zcatalyst-sdk-node");
const https = require('https');

app.use(express.json());
const axios = require("axios").default;

const sheetDocId = 'so3zb5cc3ccefd2924a47883a11ff5cd528f2';//"2uhdn70e3df2f58764e26b2406dc28fb09be0"


const credentials = {
  SheetAPIConnectorz: {
    client_id: "1000.LRHR2AT1DQ767WQOIP6IFPSRH2MOLT", //Enter your Client ID
    client_secret: "2577500a834d35a6ea8bac05149cf3a82c1c9c179b", //Enter your Client Secret
    auth_url: "https://accounts.zoho.com/oauth/v2/token",
    refresh_url: "https://accounts.zoho.com/oauth/v2/token",
    refresh_token:
      "1000.8ac024cf197f0346842a5b820d4fc310.b46acedc3b56d680a5946ff02bc88506", //Enter your Refresh Token
  },
};

app.use(express.json());
app.get("/get", (req, res) => {

  const getZohoSheetData = async(req, resourceId, worksheetName) => {
	const catalystApp = catalyst.initialize(req);
	const accessToken = await catalystApp.connection(credentials).getConnector('SheetAPIConnectorz').getAccessToken();
	console.log(accessToken)
	const options = {
		hostname: 'sheet.zoho.com',
		path: `/api/v2/${resourceId}?method=worksheet.records.fetch&worksheet_name=${encodeURIComponent(worksheetName)}`,
		headers: {

			Authorization: `Zoho-oauthtoken ${accessToken}`
		}
	}

	return new Promise((resolve, reject) => {
	  let data = "";
	  https.get(options, async(stream) => {
		stream.on("data", chunk => data += chunk);
		stream.on("end", () => resolve(JSON.parse(data)));
		stream.on("error", error => reject(error));
	  });
	});

  }
  (async () => {
	try {
	  let categorySheetData = await getZohoSheetData(req, sheetDocId, "Other brand  icons");
	  res.status(200).send(categorySheetData);
	} catch (error) {
	  console.error("Error fetching data:", error);
	}
  })();

;
});
app.all("/", (req, res) => {
  res.status(200).send("I am Live and Ready.");
});

module.exports = app;
