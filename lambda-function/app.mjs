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
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { ZBClient } from "zeebe-node";

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

const zebeeCredentials = JSON.parse(response.SecretString);

const zeebeClient = new ZBClient({
	camundaCloud: zebeeCredentials,
})

const worker = zeebeClient.createWorker({
  taskType: 'reserve-seats', 
  taskHandler: reserveSeatsHandler
})

function reserveSeatsHandler(job, _, worker) {  
  console.log("\n\n Reserve seats now...");
  console.log(job);

  // Do the real reservation
  if ("seats" !== job.variables.simulateBookingFailure) {
    console.log("Successul :-)");
    return job.complete({
        reservationId: uuidv4(),
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
          // Also mention the status of the worker
          message: `${worker.taskType} worker is running...`
      })
    };

    return response;
  };
  