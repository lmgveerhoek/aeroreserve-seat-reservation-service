/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

import { v4 as uuidv4 } from 'uuid';

// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "zeebe-credentials";

const client = new SecretsManagerClient({
  region: "eu-north-1",
});

let response;

try {
  response = await client.send(
    new GetSecretValueCommand({
      SecretId: secret_name,
    })
  );
} catch (error) {
  // For a list of exceptions thrown, see
  // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
  throw error;
}

const secret = response.SecretString;

// Your code goes here
////////////////////////////////////
// FAKE SEAT RESERVATION SERVICE
////////////////////////////////////
import { ZBClient } from "zeebe-node";

const zeebeClient = new ZBClient({
	camundaCloud: {
		clientId: secret.ZEEBE_CLIENT_ID,
		clientSecret: secret.ZEEBE_CLIENT_SECRET,
		clusterId: secret.ZEEBE_CLUSTER_ID,
	},
})

const worker = zeebeClient.createWorker('reserve-seats', reserveSeatsHandler)

function reserveSeatsHandler(job, _, worker) {  
  console.log("\n\n Reserve seats now...");
  console.log(job);

  // Do the real reservation
  // TODO: Fake some results! Fake an error (when exactly?)
  if ("seats" !== job.variables.simulateBookingFailure) {
    console.log("Successul :-)");
    return job.complete({
        reservationId: "1234",
      });
  } else {
    console.log("ERROR: Seats could not be reserved!");
    return job.error("ErrorSeatsNotAvailable");
  }
}

export const lambdaHandler = async (event, context) => {

    const response = {
      statusCode: 200,
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          message: "Serverless fucntion executed successfully!"
      })
    };

    return response;
  };
  