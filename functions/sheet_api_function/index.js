"use strict";
const express = require("express");
var app = express();
const catalyst = require("zcatalyst-sdk-node");
const https = require('https');

app.use(express.json());
const axios = require("axios").default;

const sheetDocId = 'so3zb5cc3ccefd2924a47883a11ff5cd528f2'; // Sheet Document ID


const credentials = {
  SheetAPIConnectorz: {
    client_id: "**************************************", //Enter your Client ID
    client_secret: "**************************************", //Enter your Client Secret
    auth_url: "https://accounts.zoho.com/oauth/v2/token",
    refresh_url: "https://accounts.zoho.com/oauth/v2/token",
    refresh_token:
      "**************************************", //Enter your Refresh Token
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
});
app.all("/", (req, res) => {
  res.status(200).send("I am Live and Ready.");
});

module.exports = app;
