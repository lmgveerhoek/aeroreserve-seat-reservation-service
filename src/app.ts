////////////////////////////////////
// FAKE SEAT RESERVATION SERVICE
////////////////////////////////////
import { v4 as uuidv4 } from 'uuid';
import { ZBClient } from "zeebe-node";
import 'dotenv/config'

const zeebeClient = new ZBClient();

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
