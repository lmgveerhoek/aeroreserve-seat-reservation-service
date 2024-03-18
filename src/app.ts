////////////////////////////////////
// FAKE SEAT RESERVATION SERVICE
////////////////////////////////////
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
