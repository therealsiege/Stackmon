// Copyright 2018 Stackery, Inc. All Rights Reserved.

const https = require('https');
const url = require('url');

module.exports = async (physicalResourceId, attributes, status, message, reason) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(message.ResponseURL);
    const response = {
      Status: status,
      Reason: reason,
      PhysicalResourceId: physicalResourceId,
      StackId: message.StackId,
      RequestId: message.RequestId,
      LogicalResourceId: message.LogicalResourceId,
      Data: attributes || {}
    };
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.path,
      method: 'PUT'
    };

    console.log(`Sending response back to CloudFormation: ${JSON.stringify(response, null, 2)}`);

    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve();
      } else {
        reject(new Error(`Bad response from CloudFormation Response URL: ${res.statusCode}`));
      }
    });

    req.on('error', (err) => reject(new Error(`Error while sending response to CloudFormation: ${err.message}`)));

    req.end(JSON.stringify(response));
  });
};
